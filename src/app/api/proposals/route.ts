import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { canUserReceiveBookings } from "@/lib/permissions"

export async function POST(req: Request) {
    try {
        const session = await getSession()
        const user = session?.user
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Only professionals can send proposals
        if (user.role !== "PROFESSIONAL") {
            return NextResponse.json({ error: "Solo los profesionales pueden enviar propuestas" }, { status: 403 })
        }

        // SECURITY: Validate user can receive bookings (subscription + verification)
        const canReceive = await canUserReceiveBookings()
        if (!canReceive) {
            return NextResponse.json({
                error: "Se requiere una suscripción activa e identidad verificada para enviar propuestas",
                code: "SUBSCRIPTION_REQUIRED"
            }, { status: 403 })
        }

        const body = await req.json()
        const { requestId, price, message } = body

        if (!requestId || !price) {
            return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
        }

        // Check if professional already applied
        const existingProposal = await prisma.proposal.findFirst({
            where: {
                requestId,
                providerId: user.id
            }
        })

        if (existingProposal) {
            return NextResponse.json({ error: "Ya enviaste una propuesta para este trabajo" }, { status: 400 })
        }

        // Verify Request exists and get Client ID
        const request = await prisma.request.findUnique({
            where: { id: requestId },
            select: { clientId: true, title: true }
        })

        if (!request) {
            return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
        }

        // Create Proposal
        const proposal = await prisma.proposal.create({
            data: {
                requestId,
                providerId: user.id,
                price: Number(price),
                message,
                status: "PENDING"
            }
        })

        // Notify Client
        await prisma.notification.create({
            data: {
                userId: request.clientId,
                type: "NEW_PROPOSAL",
                message: `¡Nueva propuesta! Un profesional ha ofertado en tu solicitud: ${request.title}`,
                actionUrl: `/dashboard/requests/${requestId}`
            }
        })

        return NextResponse.json(proposal)

    } catch (error) {
        console.error("Error creating proposal:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
