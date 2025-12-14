import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: matchId } = await params

        // Fetch match with user details
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                request: {
                    select: {
                        title: true,
                        description: true
                    }
                }
            }
        })

        if (!match) {
            return NextResponse.json({ error: "Match no encontrado" }, { status: 404 })
        }

        // Verify user belongs to this match
        if (match.clientId !== session.user.id && match.providerId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Add currentUserId to help determine targetId
        const response = {
            ...match,
            currentUserId: session.user.id
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error("Error fetching match:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const user = session.user

        const { id: matchId } = await params

        // Verify Match ownership (Client only?)
        // The prompt implies the Client marks it as completed ("mutual rating" follows).
        const match = await prisma.match.findUnique({
            where: { id: matchId }
        })

        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 })
        }

        // Only the client (or maybe provider too?) can mark as complete. Usually Client.
        if (match.clientId !== user.id) {
            return NextResponse.json({ error: "Solo el cliente puede marcar el trabajo como completado" }, { status: 403 })
        }

        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: { isCompleted: true }
        })

        // Ensure Request is also marked COMPLETED if not already
        await prisma.request.update({
            where: { id: match.requestId },
            data: { status: "COMPLETED" }
        })

        // Optional: Notify Provider?

        return NextResponse.json(updatedMatch)

    } catch (error) {
        console.error("Error completing match:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
