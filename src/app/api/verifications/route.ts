import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for verification request
const verificationSchema = z.object({
  idFront: z.string().min(1, 'ID front image is required'),
  idBack: z.string().min(1, 'ID back image is required'),
  certificationUrl: z.string().optional(),
});

/**
 * POST /api/verifications
 * Create a new identity verification request
 *
 * Requirements:
 * - User must be authenticated
 * - Can be CLIENT or PROFESSIONAL
 * - Images must be valid base64 or URLs
 */
export async function POST(req: NextRequest) {
  try {
    // ======================================================================
    // STEP 1: AUTHENTICATION - Verify user session
    // ======================================================================
    const session = await getSession();
    if (!session) {
      console.warn('[VERIFICATION] Unauthenticated verification request');
      return new NextResponse(
        JSON.stringify({ error: 'Autenticación requerida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // ======================================================================
    // STEP 2: CHECK USER EXISTS
    // ======================================================================
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });

    if (!user) {
      console.warn(`[VERIFICATION] User not found: ${userId}`);
      return new NextResponse(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ======================================================================
    // STEP 3: INPUT VALIDATION
    // ======================================================================
    const body = await req.json();
    const { idFront, idBack, certificationUrl } = verificationSchema.parse(body);

    // ======================================================================
    // STEP 4: CHECK FOR EXISTING VERIFICATION REQUEST
    // ======================================================================
    const existingVerification = await prisma.verificationRequest.findUnique({
      where: { userId },
    });

    if (existingVerification) {
      console.warn(`[VERIFICATION] User already has pending verification: ${userId}`);
      return new NextResponse(
        JSON.stringify({
          error: 'Ya tienes una solicitud de verificación pendiente',
          existingId: existingVerification.id,
          status: existingVerification.status,
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ======================================================================
    // STEP 5: CREATE VERIFICATION REQUEST
    // ======================================================================
    const verification = await prisma.verificationRequest.create({
      data: {
        userId,
        idFront,
        idBack,
        certificationUrl,
        status: 'PENDING', // Admin will review
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    console.info('[VERIFICATION_SUCCESS] Identity verification request created', {
      verificationId: verification.id,
      userId,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        status: verification.status,
        createdAt: verification.createdAt,
        message: 'Solicitud de verificación enviada. El administrador la revisará en breve.',
      },
    }, { status: 201 });

  } catch (error) {
    console.error('[VERIFICATION_ERROR]', error);

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
 * GET /api/verifications
 * Get current user's verification status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Autenticación requerida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verification = await prisma.verificationRequest.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        adminNote: true,
      },
    });

    if (!verification) {
      return NextResponse.json({
        status: 'NO_REQUEST',
        message: 'No tienes solicitudes de verificación',
      });
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error('[VERIFICATION_GET_ERROR]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
