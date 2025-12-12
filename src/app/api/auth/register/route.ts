import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendVerificationEmail, sendRegistrationConfirmation } from '@/lib/mail';
import { randomUUID } from 'crypto';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "PROFESSIONAL"]),
    phone: z.string().optional(),
    location: z.string().min(2, "La localidad es requerida"),
    dni: z.string().min(7).max(9),
    birthdate: z.string().transform((str) => new Date(str)),

    // Professional fields (optional)
    education: z.string().optional(),
    diploma: z.string().optional(),
    courses: z.string().optional(),
    professionalLicense: z.string().optional(),
    yearsExperience: z.number().int().min(0).max(50).optional(),
    experienceDetails: z.string().optional(),
    availability: z.object({
        morning: z.boolean().optional(),
        afternoon: z.boolean().optional(),
        evening: z.boolean().optional(),
        weekend: z.boolean().optional()
    }).optional(),
    workRadius: z.enum(["Mi ciudad", "5", "10", "20", "A convenir"]).default("Mi ciudad"),
    workZones: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.parse(body);
        const {
            name,
            email,
            password,
            role,
            phone,
            location,
            dni,
            birthdate,
            education,
            diploma,
            courses,
            professionalLicense,
            yearsExperience,
            experienceDetails,
            availability,
            workRadius,
            workZones
        } = parsed;

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

        // Create user and profile in transaction
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                phone,
                location,
                dni,
                birthdate,
                verificationToken,
                status: "PENDING",
            },
        });

        // Create profile with professional fields
        const profileData: any = {
            userId: user.id,
            badges: JSON.stringify([]),
        };

        if (role === "PROFESSIONAL") {
            profileData.education = education || null;
            profileData.diploma = diploma || null;
            profileData.courses = courses || null;
            profileData.professionalLicense = professionalLicense || null;
            profileData.yearsExperience = yearsExperience || null;
            profileData.experienceDetails = experienceDetails || null;
            profileData.availability = JSON.stringify(availability || {});
            profileData.workRadius = workRadius || "Mi ciudad";
            profileData.workZones = JSON.stringify(workZones ? workZones.split(',').map((z: string) => z.trim()) : []);
        }

        await prisma.profile.create({
            data: profileData,
        });

        // Send emails (non-blocking)
        sendRegistrationConfirmation(email, name, role).catch(e => console.error("Registration confirmation email failed", e));
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
            return new NextResponse(JSON.stringify(error.errors), { status: 400 });
        }
        // Handle Prisma Unique Constraint Violation
        if (error.code === 'P2002') {
            return new NextResponse("El usuario ya existe (email, teléfono o DNI)", { status: 409 });
        }
        return new NextResponse(`Error interno del servidor: ${error.message}`, { status: 500 });
    }
}
