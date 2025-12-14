import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"

export const dynamic = 'force-dynamic';

const verificationSchema = z.object({
    idFront: z.string().url(),
    idBack: z.string().url(),
})

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { idFront, idBack } = verificationSchema.parse(body)

        // Check if already exists
        const existing = await prisma.verificationRequest.findUnique({
            where: { userId: session.user.id }
        })

        if (existing) {
            if (existing.status === 'PENDING') {
                return NextResponse.json({ error: "Ya tienes una solicitud pendiente" }, { status: 400 })
            }
            if (existing.status === 'APPROVED') {
                return NextResponse.json({ error: "Ya estás verificado" }, { status: 400 })
            }
            // If REJECTED, allow re-submission (update)
            await prisma.verificationRequest.update({
                where: { userId: session.user.id },
                data: {
                    idFront,
                    idBack,
                    status: "PENDING",
                    adminNote: null
                }
            })
        } else {
            // Create new
            await prisma.verificationRequest.create({
                data: {
                    userId: session.user.id,
                    idFront,
                    idBack,
                    status: "PENDING"
                }
            })
        }

        return NextResponse.json({ success: true, status: "PENDING" })

    } catch (error) {
        console.error("Verification submit error:", error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
        }
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const request = await prisma.verificationRequest.findUnique({
            where: { userId: session.user.id }
        })

        return NextResponse.json(request || { status: "IDLE" })

    } catch (error) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
