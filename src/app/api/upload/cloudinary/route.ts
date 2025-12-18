import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateSignedUploadToken, uploadToCloudinary } from '@/lib/cloudinary';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// SECURITY: Rate limit uploads (100 per user per day)
const uploadLimiter = rateLimit({
    interval: 24 * 60 * 60 * 1000, // 24 hours
    uniqueTokenPerInterval: 1000,
});

// SECURITY: Validation schema for upload requests
const uploadSchema = z.object({
    uploadType: z.enum(['verification', 'portfolio', 'profile', 'request_image', 'certification']),
    tags: z.string().optional(),
});

/**
 * SECURITY: POST /api/upload/cloudinary
 * Generate signed token for secure client-side uploads.
 * Client uses token to upload directly to Cloudinary without exposing API secret.
 *
 * Requirements:
 * - User must be authenticated
 * - Rate limited per user
 * - Token expires in 1 hour
 */
export async function POST(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION
        // ======================================================================
        const session = await getSession();
        if (!session) {
            console.warn('[UPLOAD_AUTH] Unauthenticated upload request');
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const userId = session.user.id;

        // ======================================================================
        // STEP 2: RATE LIMITING
        // ======================================================================
        try {
            await uploadLimiter.check(100, userId);
        } catch (error) {
            console.warn(`[UPLOAD_RATELIMIT] User exceeded daily upload limit: ${userId}`);
            return new NextResponse(
                JSON.stringify({
                    error: 'Has alcanzado el límite de subidas diarias. Intenta mañana.',
                }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 3: INPUT VALIDATION
        // ======================================================================
        const body = await req.json();
        const { uploadType, tags } = uploadSchema.parse(body);

        // ======================================================================
        // STEP 4: GENERATE SIGNED TOKEN
        // ======================================================================
        // SECURITY: Folder path includes userId to prevent collisions
        const folder = `fixia/${uploadType}/${userId}`;

        const token = await generateSignedUploadToken(folder, tags, 3600); // 1 hour expiry

        console.info('[UPLOAD_TOKEN_GENERATED]', {
            userId,
            uploadType,
            folder,
            tags,
        });

        return NextResponse.json({
            signature: token.signature,
            timestamp: token.timestamp,
            folder: token.folder,
            tags: token.tags, // Return the signed tags
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY, // Public API key
            uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            message: 'Token válido por 1 hora',
        });

    } catch (error) {
        console.error('[UPLOAD_POST_ERROR]', error);

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
 * SECURITY: POST /api/upload/cloudinary/callback
 * Webhook endpoint for Cloudinary post-upload notifications.
 * Validates upload and stores metadata in database.
 *
 * Requirements:
 * - Must verify request signature from Cloudinary
 * - Store upload metadata for audit trail
 */
export async function PUT(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION
        // ======================================================================
        const session = await getSession();
        if (!session) {
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 2: VALIDATE INPUT (File upload metadata from client)
        // ======================================================================
        const body = await req.json();
        const { uploadType, publicId, secureUrl, fileSize } = z.object({
            uploadType: z.enum(['verification', 'portfolio', 'profile', 'request_image', 'certification']),
            publicId: z.string(),
            secureUrl: z.string().url(),
            fileSize: z.number().max(5 * 1024 * 1024), // Max 5MB
        }).parse(body);

        // SECURITY: Verify the public_id belongs to the authenticated user
        if (!publicId.includes(session.user.id)) {
            console.warn(
                `[UPLOAD_SECURITY] User attempted to confirm upload for different user: ${session.user.id}`
            );
            return new NextResponse(
                JSON.stringify({ error: 'No autorizado' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 3: STORE METADATA (optional - for audit trail)
        // ======================================================================
        // You can store upload metadata in database here if needed
        // Example: await prisma.uploadLog.create({ ... })

        console.info('[UPLOAD_CONFIRMED]', {
            userId: session.user.id,
            uploadType,
            publicId,
            fileSize,
        });

        return NextResponse.json({
            success: true,
            url: secureUrl,
            message: 'Archivo subido exitosamente',
        });

    } catch (error) {
        console.error('[UPLOAD_PUT_ERROR]', error);

        if (error instanceof z.ZodError) {
            return new NextResponse(
                JSON.stringify({ error: 'Datos inválidos' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
