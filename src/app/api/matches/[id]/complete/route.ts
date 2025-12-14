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
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: matchId } = await params
        const { approved, comment } = await req.json()

        // Validate input
        if (typeof approved !== "boolean") {
            return NextResponse.json({ error: "Campo 'approved' es requerido" }, { status: 400 })
        }

        // Get match to verify user belongs to it
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: {
                id: true,
                providerId: true,
                clientId: true,
                isCompleted: true
            }
        })

        if (!match) {
            return NextResponse.json({ error: "Match no encontrado" }, { status: 404 })
        }

        // Verify user is part of this match
        const isProvider = match.providerId === session.user.id
        const isClient = match.clientId === session.user.id

        if (!isProvider && !isClient) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // If provider marking complete, they must provide a comment
        if (isProvider && approved && (!comment || !comment.trim())) {
            return NextResponse.json(
                { error: "Por favor agrega un comentario sobre el trabajo realizado" },
                { status: 400 }
            )
        }

        // Update match with approval status
        const updateData: any = {}

        if (isProvider) {
            updateData.providerApprovedCompletion = approved
            if (comment) {
                updateData.providerCompletionComment = comment
            }
        } else if (isClient) {
            updateData.clientApprovedCompletion = approved
        }

        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: updateData,
            select: {
                id: true,
                providerApprovedCompletion: true,
                clientApprovedCompletion: true,
                isCompleted: true
            }
        })

        // If both parties have approved, mark as fully completed
        if (updatedMatch.providerApprovedCompletion && updatedMatch.clientApprovedCompletion && !updatedMatch.isCompleted) {
            await prisma.match.update({
                where: { id: matchId },
                data: { isCompleted: true }
            })
            updatedMatch.isCompleted = true
        }

        return NextResponse.json({
            clientApproved: updatedMatch.clientApprovedCompletion,
            providerApproved: updatedMatch.providerApprovedCompletion,
            completedAt: updatedMatch.isCompleted ? new Date() : null
        })

    } catch (error) {
        console.error("[MATCH_COMPLETE_POST]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
