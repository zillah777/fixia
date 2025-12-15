import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/mail"
import { v4 as uuidv4 } from "uuid"

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    location: z.string().min(2),
    dni: z.string().min(7).max(9).regex(/^\d+$/),
    password: z.string().min(6),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "PROFESSIONAL"]),
    // Professional fields (optional)
    education: z.string().optional(),
    diploma: z.string().optional(),
    courses: z.string().optional(),
    professionalLicense: z.string().optional(),
    yearsExperience: z.number().optional(),
    experienceDetails: z.string().optional(),
    availability: z.object({
        morning: z.boolean().optional(),
        afternoon: z.boolean().optional(),
        evening: z.boolean().optional(),
        weekend: z.boolean().optional()
    }).optional(),
    workRadius: z.enum(["Mi ciudad", "5", "10", "20", "A convenir"]).default("Mi ciudad"),
    workZones: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate request body
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const data = validation.data

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone: data.phone },
                    { dni: data.dni }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.email === data.email) {
                return NextResponse.json(
                    { error: "Este email ya está registrado" },
                    { status: 409 }
                )
            }
            if (existingUser.phone === data.phone) {
                return NextResponse.json(
                    { error: "Este teléfono ya está registrado" },
                    { status: 409 }
                )
            }
            if (existingUser.dni === data.dni) {
                return NextResponse.json(
                    { error: "Este DNI ya está registrado" },
                    { status: 409 }
                )
            }
        }

        // Hash password
        const hashedPassword = await hash(data.password, 12)

        // Generate verification token
        const verificationToken = uuidv4()

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                phone: data.phone,
                dni: data.dni,
                birthdate: body.birthdate ? new Date(body.birthdate) : null,
                location: data.location,
                password: hashedPassword,
                role: data.role,
                status: "PENDING", // Email verification required
                verificationToken,
                // Professional fields
                ...(data.role === "PROFESSIONAL" && {
                    profile: {
                        create: {
                            education: data.education || null,
                            diploma: data.diploma || null,
                            courses: data.courses || null,
                            professionalLicense: data.professionalLicense || null,
                            yearsExperience: data.yearsExperience || null,
                            experienceDetails: data.experienceDetails || null,
                            availability: data.availability ? JSON.stringify(data.availability) : null,
                            workRadius: data.workRadius,
                            workZones: data.workZones || null,
                        }
                    }
                })
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.name || "Usuario", verificationToken)
        } catch (emailError) {
            console.error("Error sending verification email:", emailError)
            // Don't fail the registration if email fails, but log it
        }

        return NextResponse.json(
            {
                message: "Cuenta creada exitosamente. Por favor verifica tu email.",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Register error:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
