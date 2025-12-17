import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return new NextResponse(
                JSON.stringify({ error: 'Email inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if user exists (security)
            return new NextResponse(
                JSON.stringify({ message: 'Si el email existe, recibirás el email de verificación' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If already verified, don't resend
        if (user.status === 'ACTIVE') {
            return new NextResponse(
                JSON.stringify({ message: 'Tu cuenta ya está verificada' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate NEW token to replace expired one
        const newToken = randomUUID();

        // Update user with new verification token
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken: newToken }
        });

        // Send verification email with NEW token (non-blocking)
        sendVerificationEmail(user.email, user.name, newToken).catch(error => {
            console.error('Failed to send verification email:', error);
        });

        return new NextResponse(
            JSON.stringify({ message: 'Email de verificación reenviado' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Resend verification error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error al reenviar email' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
