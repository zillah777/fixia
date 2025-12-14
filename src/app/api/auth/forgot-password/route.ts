import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
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
                JSON.stringify({ message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Generate password reset token
        const resetToken = randomUUID();
        const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // Store reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpires
            }
        });

        // Send password reset email (non-blocking)
        sendPasswordResetEmail(user.email, user.name, resetToken).catch(error => {
            console.error('Failed to send password reset email:', error);
        });

        return new NextResponse(
            JSON.stringify({ message: 'Email de recuperación enviado' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error al procesar solicitud' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
