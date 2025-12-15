import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { notifyUser } from "@/lib/notifications"

export const dynamic = 'force-dynamic';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            console.error("[MATCH_COMPLETE_POST] Unauthorized: No session found")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: matchId } = await params

        let bodyText;
        try {
            bodyText = await req.text()
            console.log("[MATCH_COMPLETE_POST] Raw body:", bodyText)
        } catch (e) {
            console.error("[MATCH_COMPLETE_POST] Error reading body text:", e)
            return NextResponse.json({ error: "Error reading body" }, { status: 400 })
        }

        let body;
        try {
            body = bodyText ? JSON.parse(bodyText) : {}
        } catch (e) {
            console.error("[MATCH_COMPLETE_POST] Error parsing JSON body:", e)
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
        }

        console.log("[MATCH_COMPLETE_POST] Parsed body:", body)
        const { approved, comment } = body

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

        // If provider marking complete, comment is optional now
        // if (isProvider && approved && (!comment || !comment.trim())) {
        //     return NextResponse.json(
        //         { error: "Por favor agrega un comentario sobre el trabajo realizado" },
        //         { status: 400 }
        //     )
        // }

        // Update match with approval status
        const updateData: any = {}

        if (isProvider) {
            updateData.providerApprovedCompletion = approved
            if (comment) {
                updateData.providerCompletionComment = comment
            }
            // NOTIFY CLIENT
            if (approved) {
                await notifyUser({
                    userId: match.clientId,
                    type: "MATCH_UPDATE",
                    title: "Solicitud de Completado",
                    message: "El profesional ha marcado el trabajo como completado. Por favor confirma.",
                    actionUrl: `/dashboard/requests/${match.requestId}` // Client view
                })
            }
        } else if (isClient) {
            updateData.clientApprovedCompletion = approved
            // NOTIFY PROVIDER
            if (approved) {
                await notifyUser({
                    userId: match.providerId,
                    type: "MATCH_UPDATE",
                    title: "Trabajo Aprobado",
                    message: "El cliente ha confirmado que el trabajo está completado.",
                    actionUrl: `/dashboard/matches/${match.id}` // Provider view
                })
            }
        }

        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: updateData,
            select: {
                id: true,
                requestId: true,
                providerApprovedCompletion: true,
                clientApprovedCompletion: true,
                isCompleted: true,
                providerId: true,
                clientId: true
            }
        })

        // If both parties have approved, mark as fully completed
        if (updatedMatch.providerApprovedCompletion && updatedMatch.clientApprovedCompletion && !updatedMatch.isCompleted) {
            await prisma.match.update({
                where: { id: matchId },
                data: { isCompleted: true }
            })
            updatedMatch.isCompleted = true

            // NOTIFY BOTH: READY FOR REVIEW
            // Client
            await notifyUser({
                userId: updatedMatch.clientId,
                type: "MATCH_COMPLETED",
                title: "¡Trabajo Finalizado!",
                message: "El proceso ha terminado correctamente. Por favor califica tu experiencia.",
                actionUrl: `/dashboard/requests/${updatedMatch.requestId}`
            })
            // Provider
            await notifyUser({
                userId: updatedMatch.providerId,
                type: "MATCH_COMPLETED",
                title: "¡Trabajo Finalizado!",
                message: "El proceso ha terminado correctamente. Por favor califica al cliente.",
                actionUrl: `/dashboard/matches/${updatedMatch.id}`
            })
        }

        return NextResponse.json({
            clientApproved: updatedMatch.clientApprovedCompletion,
            providerApproved: updatedMatch.providerApprovedCompletion,
            completedAt: updatedMatch.isCompleted ? new Date() : null
        })

    } catch (error) {
        console.error("[MATCH_COMPLETE_POST] Error:", error)
        if (error instanceof Error) {
            console.error("[MATCH_COMPLETE_POST] Stack:", error.stack)
        }
        return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 })
    }
}
