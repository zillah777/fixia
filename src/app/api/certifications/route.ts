import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for certification request
const certificationSchema = z.object({
  title: z.string().min(1, 'Certification title is required'),
  issuingBody: z.string().min(1, 'Issuing body is required'),
  issueDate: z.string().transform((str) => new Date(str)),
  certificateImage: z.string().min(1, 'Certificate image is required'),
  certificateNumber: z.string().optional(),
});

/**
 * POST /api/certifications
 * Create a new certification/credential verification request
 *
 * Requirements:
 * - User must be authenticated
 * - User must be PROFESSIONAL
 * - Certificate image must be valid (base64 or URL)
 */
export async function POST(req: NextRequest) {
  try {
    // STEP 1: AUTHENTICATION - Verify user session
    const session = await getSession();
    if (!session) {
      console.warn('[CERTIFICATION] Unauthenticated certification request');
      return new NextResponse(
        JSON.stringify({ error: 'Autenticación requerida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // STEP 2: CHECK USER EXISTS AND IS PROFESSIONAL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });

    if (!user) {
      console.warn(`[CERTIFICATION] User not found: ${userId}`);
      return new NextResponse(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (user.role !== 'PROFESSIONAL') {
      console.warn(`[CERTIFICATION] Non-professional user attempting certification: ${userId}`);
      return new NextResponse(
        JSON.stringify({ error: 'Solo profesionales pueden verificar certificaciones' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // STEP 3: INPUT VALIDATION
    const body = await req.json();
    const { title, issuingBody, issueDate, certificateImage, certificateNumber } = certificationSchema.parse(body);

    // STEP 4: CREATE CERTIFICATION REQUEST
    const certification = await prisma.certificationVerification.create({
      data: {
        userId,
        title,
        issuingBody,
        issueDate,
        certificateImage,
        certificateNumber,
        status: 'PENDING',
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

    console.info('[CERTIFICATION_SUCCESS] Certification verification request created', {
      certificationId: certification.id,
      userId,
      title,
    });

    return NextResponse.json({
      success: true,
      certification, // Return the full object
    }, { status: 201 });

  } catch (error) {
    console.error('[CERTIFICATION_ERROR]', error);

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
 * GET /api/certifications
 * Get current user's certification verification status
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

    const certifications = await prisma.certificationVerification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!certifications || certifications.length === 0) {
      return NextResponse.json({
        status: 'NO_REQUEST',
        message: 'No tienes solicitudes de certificación',
        certifications: [],
      });
    }

    return NextResponse.json({
      status: 'HAS_REQUESTS',
      certifications,
    });
  } catch (error) {
    console.error('[CERTIFICATION_GET_ERROR]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
