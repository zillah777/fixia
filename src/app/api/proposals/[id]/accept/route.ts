import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PATCH(
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

        // get Proposal to check ownership of Request
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                request: true
            }
        })

        if (!proposal) {
            return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 })
        }

        // Only the client of the request can accept a proposal
        if (proposal.request.clientId !== user.id) {
            return NextResponse.json({ error: "No tienes permiso para aceptar esta propuesta" }, { status: 403 })
        }

        if (proposal.request.status !== "OPEN") {
            return NextResponse.json({ error: "Esta solicitud ya no está abierta" }, { status: 400 })
        }

        // Transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Proposal Status
            const updatedProposal = await tx.proposal.update({
                where: { id: proposalId },
                data: { status: "ACCEPTED" }
            })

            // 2. Update Request Status
            await tx.request.update({
                where: { id: proposal.requestId },
                data: { status: "IN_PROGRESS" }
            })

            // 3. Create Match
            const match = await tx.match.create({
                data: {
                    requestId: proposal.requestId,
                    clientId: user.id,
                    providerId: proposal.providerId,
                    isCompleted: false
                }
            })

            // 4. Notify the professional
            await tx.notification.create({
                data: {
                    userId: proposal.providerId,
                    type: "PROPOSAL_ACCEPTED",
                    message: `¡Tu propuesta para "${proposal.request.title}" fue aceptada! Ya puedes coordinar con el cliente.`,
                    actionUrl: `/dashboard/matches/${match.id}`
                }
            })

            return match
        })

        return NextResponse.json(result)

    } catch (error) {
        console.error("Error accepting proposal:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
