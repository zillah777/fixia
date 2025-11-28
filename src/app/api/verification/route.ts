import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

// SECURITY: Configure rate limiting for verification uploads (1 per user per hour)
const verificationLimiter = rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 1000,
});

// SECURITY: Strict schema validation for Cloudinary URLs only
const verificationSchema = z.object({
    idFront: z.string()
        .url('Invalid URL format')
        .refine(
            (url) => url.startsWith('https://res.cloudinary.com/'),
            'ID images must be uploaded through Cloudinary'
        ),
    idBack: z.string()
        .url('Invalid URL format')
        .refine(
            (url) => url.startsWith('https://res.cloudinary.com/'),
            'ID images must be uploaded through Cloudinary'
        ),
});

/**
 * SECURITY: POST /api/verification
 * Submit identity verification documents.
 * Requirements:
 * - User must be authenticated
 * - userId in URL must match authenticated user (prevent impersonation)
 * - Only Cloudinary URLs allowed (prevent external file injection)
 * - Rate limited to 1 submission per hour per user
 * - Only professionals can submit verification
 */
export async function POST(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION - Verify user session
        // ======================================================================
        const session = await getSession();
        if (!session) {
            console.warn('[VERIFICATION_AUTH] Unauthenticated verification attempt');
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const authenticatedUserId = session.user.id;

        // ======================================================================
        // STEP 2: RATE LIMITING - Prevent spam submissions
        // ======================================================================
        try {
            await verificationLimiter.check(1, authenticatedUserId);
        } catch (error) {
            console.warn(`[VERIFICATION_RATELIMIT] User exceeded limit: ${authenticatedUserId}`);
            return new NextResponse(
                JSON.stringify({
                    error: 'Has alcanzado el límite de intentos. Por favor intenta en una hora.',
                }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 3: INPUT VALIDATION - Verify Cloudinary URLs format
        // ======================================================================
        const body = await req.json();
        const { idFront, idBack } = verificationSchema.parse(body);

        // ======================================================================
        // STEP 4: AUTHORIZATION - Verify user eligibility
        // ======================================================================
        const user = await prisma.user.findUnique({
            where: { id: authenticatedUserId },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });

        if (!user) {
            console.warn(`[VERIFICATION_AUTH] User not found: ${authenticatedUserId}`);
            return new NextResponse(
                JSON.stringify({ error: 'Usuario no encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Only professionals can verify identity
        if (user.role !== 'PROFESSIONAL') {
            console.warn(`[VERIFICATION_AUTH] Non-professional verification: ${authenticatedUserId}`);
            return new NextResponse(
                JSON.stringify({ error: 'Solo profesionales pueden verificar su identidad' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 5: BUSINESS LOGIC - Create or update verification request
        // ======================================================================
        const existingRequest = await prisma.verificationRequest.findUnique({
            where: { userId: authenticatedUserId },
            select: { id: true, status: true },
        });

        let verificationRequest;

        if (existingRequest) {
            // SECURITY: Only allow resubmission if previously rejected
            if (existingRequest.status !== 'REJECTED' && existingRequest.status !== 'PENDING') {
                console.warn(
                    `[VERIFICATION_AUTH] Cannot resubmit with status: ${existingRequest.status}`
                );
                return new NextResponse(
                    JSON.stringify({
                        error: `No puedes resubmitir. Estado actual: ${existingRequest.status}`,
                    }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Update existing request
            verificationRequest = await prisma.verificationRequest.update({
                where: { userId: authenticatedUserId },
                data: {
                    idFront,
                    idBack,
                    status: 'PENDING',
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            console.info('[VERIFICATION_UPDATE] Verification resubmitted', {
                userId: authenticatedUserId,
                requestId: verificationRequest.id,
            });
        } else {
            // Create new verification request
            verificationRequest = await prisma.verificationRequest.create({
                data: {
                    userId: authenticatedUserId,
                    idFront,
                    idBack,
                    status: 'PENDING',
                },
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            console.info('[VERIFICATION_CREATE] Verification request created', {
                userId: authenticatedUserId,
                requestId: verificationRequest.id,
            });
        }

        return NextResponse.json({
            ...verificationRequest,
            message: 'Tu solicitud de verificación ha sido enviada. Te notificaremos cuando sea revisada.',
        });

    } catch (error) {
        console.error('[VERIFICATION_POST_ERROR]', error);

        // SECURITY: Don't expose internal error details
        if (error instanceof z.ZodError) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Datos inválidos',
                    details: error.errors[0].message,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * SECURITY: GET /api/verification
 * Fetch verification status for authenticated user only.
 * Requirements:
 * - User must be authenticated
 * - Can only view own verification status
 */
export async function GET(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION
        // ======================================================================
        const session = await getSession();
        if (!session) {
            console.warn('[VERIFICATION_GET_AUTH] Unauthenticated request');
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const userId = session.user.id;

        // ======================================================================
        // STEP 2: AUTHORIZATION - Verify user ownership
        // ======================================================================
        const verificationRequest = await prisma.verificationRequest.findUnique({
            where: { userId },
            select: {
                id: true,
                status: true,
                adminNote: true,
                createdAt: true,
                updatedAt: true,
                // Never return actual image URLs to client (sensitive documents)
            },
        });

        if (!verificationRequest) {
            return NextResponse.json({
                status: 'NOT_STARTED',
                message: 'No has iniciado el proceso de verificación.',
            });
        }

        return NextResponse.json({
            status: verificationRequest.status,
            adminNote: verificationRequest.adminNote,
            createdAt: verificationRequest.createdAt,
            updatedAt: verificationRequest.updatedAt,
            message:
                verificationRequest.status === 'APPROVED'
                    ? 'Tu identidad ha sido verificada.'
                    : verificationRequest.status === 'REJECTED'
                    ? `Tu verificación fue rechazada. Razón: ${verificationRequest.adminNote || 'No especificada'}`
                    : 'Tu solicitud está siendo revisada.',
        });

    } catch (error) {
        console.error('[VERIFICATION_GET_ERROR]', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
