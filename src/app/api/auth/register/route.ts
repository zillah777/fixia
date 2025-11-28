import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/mail';
import { randomUUID } from 'crypto';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CLIENT", "PROFESSIONAL"]),
    phone: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, phone } = registerSchema.parse(body);

        // Check if user exists (email or phone)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: phone || undefined }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return new NextResponse("El email ya está registrado", { status: 409 });
            }
            if (existingUser.phone === phone) {
                return new NextResponse("El teléfono ya está registrado", { status: 409 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = randomUUID();

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                phone,
                verificationToken,
            },
        });

        // Send emails (non-blocking)
        sendWelcomeEmail(email, name).catch(e => console.error("Welcome email failed", e));
        sendVerificationEmail(email, verificationToken).catch(e => console.error("Verification email failed", e));

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('[REGISTER_ERROR]', error);
        if (error instanceof z.ZodError) {
            return new NextResponse("Datos inválidos", { status: 400 });
        }
        // Handle Prisma Unique Constraint Violation
        if (error.code === 'P2002') {
            return new NextResponse("El usuario ya existe (email o teléfono)", { status: 409 });
        }
        return new NextResponse(`Error interno del servidor: ${error.message}`, { status: 500 });
    }
}
