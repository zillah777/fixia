import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token || typeof token !== 'string') {
            return new NextResponse(
                JSON.stringify({ error: 'Token inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Find user with this verification token
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: 'Token expirado o inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Mark user as verified (ACTIVE)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                status: 'ACTIVE',
                verificationToken: null // Clear token after use
            }
        });

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Email verificado correctamente' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error al verificar email' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
