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
    dni: z.string().min(7).max(9),
    birthdate: z.string().transform((str) => new Date(str)),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, phone, dni, birthdate } = registerSchema.parse(body);

        // Check if user exists (email, phone or dni)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone: phone || undefined },
                    { dni }
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
            if (existingUser.dni === dni) {
                return new NextResponse("El DNI ya está registrado", { status: 409 });
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
                dni,
                birthdate,
                status: 'PENDING', // Email verification is mandatory before login
                verificationToken,
                // TRIAL PROMOTION: Professionals get 30 days free trial
                // After trial expires, they must pay for continued access
                ...(role === "PROFESSIONAL" && {
                    subscriptionPlan: "professional_plan",
                    subscriptionStatus: "trial", // 30-day trial period
                    subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                    canCreateServices: true,     // Enabled during trial
                    listingVisible: true,        // Visible in marketplace during trial
                    canReceiveBookings: true,    // Can receive proposals during trial
                    profile: {
                        create: {
                            education: body.education || undefined,
                            diploma: body.diploma || undefined,
                            certification: body.diploma || undefined, // Sync both field names
                            courses: body.courses || undefined,
                            professionalLicense: body.professionalLicense || undefined,
                            licenseNumber: body.professionalLicense || undefined, // Sync both field names
                            yearsExperience: body.yearsExperience ? parseInt(body.yearsExperience) : undefined,
                            experienceDetails: body.experienceDetails || undefined,
                            experience: body.experienceDetails || undefined, // Sync both field names
                            availability: body.availability ? JSON.stringify(body.availability) : "{}",
                            workRadius: body.workRadius || "Mi ciudad",
                            workZones: body.workZones || undefined,
                            tags: body.tags && Array.isArray(body.tags) ? JSON.stringify(body.tags) : "[]",
                            badges: JSON.stringify(["TRIAL"]) // Trial badge visible during free period
                        }
                    }
                })
            },
        });

        // Send emails (non-blocking)
        sendWelcomeEmail(email, name).catch(e => console.error("Welcome email failed", e));
        sendVerificationEmail(email, name, verificationToken).catch(e => console.error("Verification email failed", e));

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
            return new NextResponse("El usuario ya existe (email, teléfono o DNI)", { status: 409 });
        }
        return new NextResponse(`Error interno del servidor: ${error.message}`, { status: 500 });
    }
}
