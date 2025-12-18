import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * POST /api/dev/create-test-professional
 *
 * ⚠️ DEVELOPMENT ONLY - Creates a fully-enabled professional account for testing
 * This endpoint should ONLY be used in development/testing environments
 *
 * Request Body:
 * {
 *   "name": "Test Professional",
 *   "email": "test@example.com",
 *   "password": "password123",
 *   "phone": "1234567890",
 *   "dni": "12345678",
 *   "birthdate": "1990-01-01",
 *   "category": "plomeria" // optional
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "user": {
 *     "id": "...",
 *     "email": "...",
 *     "role": "PROFESSIONAL",
 *     "name": "...",
 *     "canCreateServices": true,
 *     "listingVisible": true,
 *     "canReceiveBookings": true,
 *     "subscriptionStatus": "ACTIVE"
 *   },
 *   "note": "This is a test account with all features enabled"
 * }
 */
export async function POST(req: Request) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      dni,
      birthdate,
      category = 'plomeria',
    } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
          ...(dni ? [{ dni }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: `User already exists with this ${existingUser.email === email ? 'email' : existingUser.phone === phone ? 'phone' : 'DNI'}` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create professional user with all features enabled
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'PROFESSIONAL',
        phone,
        dni,
        birthdate: birthdate ? new Date(birthdate) : new Date('1990-01-01'),
        status: 'ACTIVE', // Automatically active for testing
        // Enable all professional features for testing
        canCreateServices: true,
        listingVisible: true,
        canReceiveBookings: true,
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        // Create professional profile
        profile: {
          create: {
            bio: "Este es un perfil profesional de prueba con todas las funciones habilitadas.",
            yearsExperience: 5,
            workRadius: 'Mi ciudad',
            availability: JSON.stringify({
              monday: { start: '09:00', end: '18:00' },
              tuesday: { start: '09:00', end: '18:00' },
              wednesday: { start: '09:00', end: '18:00' },
              thursday: { start: '09:00', end: '18:00' },
              friday: { start: '09:00', end: '18:00' },
              saturday: { start: '09:00', end: '13:00' },
              sunday: null,
            }),
            tags: JSON.stringify(['testing', 'development']),
            badges: JSON.stringify([
              "VERIFIED" // Normalizing to string badge
            ]),
            ratingAvg: 5.0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.info('[DEV] Test professional created:', {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        canCreateServices: user.canCreateServices,
        listingVisible: user.listingVisible,
        canReceiveBookings: user.canReceiveBookings,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndsAt: user.subscriptionEndsAt,
      },
      credentials: {
        email,
        password, // Return plain password for convenience in development
      },
      note: 'This is a development test account with all professional features enabled. Ready for testing!',
    });
  } catch (error) {
    console.error('[DEV_CREATE_TEST_PROFESSIONAL_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create test professional account', details: String(error) },
      { status: 500 }
    );
  }
}
