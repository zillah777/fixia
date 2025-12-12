import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = resetPasswordSchema.parse(body);

        const { token, password } = parsed;

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date() // Token must not be expired
                }
            }
        });

        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: 'Token expirado o inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        });

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Contraseña actualizada correctamente' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(
                JSON.stringify({ errors: error.errors }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        console.error('Reset password error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error al restablecer contraseña' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
