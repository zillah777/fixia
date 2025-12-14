import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { encrypt, setSessionCookie, SessionPayload } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// SECURITY: Rate limiting - 5 attempts per minute per IP
const loginLimiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
});

// SECURITY: Input validation schema
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

/**
 * SECURITY: POST /api/auth/login
 * Authenticate user and create secure session.
 *
 * Requirements:
 * - Valid email and password
 * - Rate limited to 5 attempts/minute per IP
 * - Password must match bcrypt hash
 * - Session token is short-lived (15 minutes)
 * - Cookie is HttpOnly and Secure
 */
export async function POST(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: RATE LIMITING - Prevent brute force attacks
        // ======================================================================
        const ip = req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown';

        try {
            await loginLimiter.check(5, ip);
        } catch (error) {
            console.warn(`[LOGIN_RATELIMIT] IP exceeded limit: ${ip}`);
            return new NextResponse(
                JSON.stringify({
                    error: 'Demasiados intentos. Por favor espera un minuto.',
                }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 2: INPUT VALIDATION
        // ======================================================================
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        // ======================================================================
        // STEP 3: AUTHENTICATION - Verify user and password
        // ======================================================================
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                status: true,
                avatar: true,
            },
        });

        // SECURITY: Don't reveal if user exists
        if (!user) {
            console.warn(`[LOGIN_AUTH] User not found: ${email}`);
            return new NextResponse(
                JSON.stringify({ error: 'Credenciales inválidas' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Check if account is active
        if (user.status === 'PENDING') {
            return new NextResponse(
                JSON.stringify({
                    error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.',
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (user.status !== 'ACTIVE') {
            console.warn(`[LOGIN_AUTH] User account inactive: ${user.id}`);
            return new NextResponse(
                JSON.stringify({
                    error: 'Tu cuenta está deshabilitada. Contacta con soporte.',
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Verify password using bcrypt constant-time comparison
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.warn(`[LOGIN_AUTH] Invalid password for user: ${user.id}`);
            return new NextResponse(
                JSON.stringify({ error: 'Credenciales inválidas' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 4: CREATE SESSION - Generate JWT token
        // ======================================================================
        const sessionPayload: SessionPayload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        };

        const token = await encrypt(sessionPayload);

        // ======================================================================
        // STEP 5: SET SECURE COOKIE
        // ======================================================================
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });

        await setSessionCookie(token, response);

        console.info('[LOGIN_SUCCESS]', {
            userId: user.id,
            email: user.email,
            ip,
        });

        return response;

    } catch (error) {
        console.error('[LOGIN_ERROR]', error);

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

