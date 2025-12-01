import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { requestId, providerId, proposalId } = body

        if (!requestId || !providerId || !proposalId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Verify Request belongs to user
        const req = await prisma.request.findUnique({
            where: { id: requestId }
        })

        if (!req || req.clientId !== session.payload.id) {
            return NextResponse.json({ error: "Unauthorized or Request not found" }, { status: 403 })
        }

        // 2. Create Match
        const match = await prisma.match.create({
            data: {
                requestId,
                providerId,
                clientId: session.payload.id as string
            }
        })

        // 3. Update Proposal Status
        await prisma.proposal.update({
            where: { id: proposalId },
            data: { status: "ACCEPTED" }
        })

        // 4. Update Request Status
        await prisma.request.update({
            where: { id: requestId },
            data: { status: "MATCHED" }
        })

        // 5. Create Notification for Provider
        await prisma.notification.create({
            data: {
                userId: providerId,
                type: "MATCH",
                message: `¡Tu propuesta para "${req.title}" ha sido aceptada!`,
                actionUrl: `/dashboard/requests/${requestId}`
            }
        })

        return NextResponse.json(match)
    } catch (error) {
        console.error("Error creating match:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
