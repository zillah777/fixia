import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        const user = session?.user
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: proposalId } = await params

        // Fetch proposal with request details
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                request: true
            }
        })

        if (!proposal) {
            return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 })
        }

        let notificationTargetId: string | null = null
        let notificationMessage = ""

        // Case 1: Professional rejects a "Hire" request (Pro is provider)
        if (proposal.status === "PENDING_PRO_APPROVAL" && proposal.providerId === user.id) {
            // Pro is rejecting the client's direct hire
            notificationTargetId = proposal.request.clientId
            notificationMessage = `El profesional ${user.name} ha rechazado tu solicitud de contratación para: ${proposal.request.title}.`
        }
        // Case 2: Client rejects a Professional's proposal (Client is request owner)
        else if (proposal.status === "PENDING" && proposal.request.clientId === user.id) {
            // Client is rejecting the pro's application
            notificationTargetId = proposal.providerId
            notificationMessage = `El cliente ha rechazado tu propuesta para: ${proposal.request.title}.`
        }
        else {
            return NextResponse.json({ error: "No tienes permiso para rechazar esta propuesta o ya fue procesada" }, { status: 403 })
        }

        // Transaction
        await prisma.$transaction(async (tx) => {
            // Update status
            await tx.proposal.update({
                where: { id: proposalId },
                data: { status: "REJECTED" }
            })

            // Create notification
            if (notificationTargetId) {
                await tx.notification.create({
                    data: {
                        userId: notificationTargetId,
                        type: "PROPOSAL_REJECTED",
                        message: notificationMessage,
                        actionUrl: `/dashboard/requests/${proposal.requestId}`
                    }
                })
            }
        })

        return NextResponse.json({ success: true, message: "Propuesta rechazada" })

    } catch (error) {
        console.error("Error rejecting proposal:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
