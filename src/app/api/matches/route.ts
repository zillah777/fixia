import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { sendMatchNotification } from "@/lib/mail"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id
        const role = session.user.role

        let matches: any[] = []

        if (role === 'CLIENT') {
            matches = await prisma.match.findMany({
                where: { clientId: userId },
                include: {
                    provider: { select: { name: true, email: true, phone: true } },
                    reviews: true, // Include reviews to check for unrated
                    request: {
                        select: {
                            title: true,
                            location: true,
                            proposals: {
                                where: { status: "ACCEPTED" },
                                select: { message: true, price: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        } else if (role === 'PROFESSIONAL') {
            matches = await prisma.match.findMany({
                where: { providerId: userId },
                include: {
                    client: { select: { name: true, email: true, phone: true } },
                    reviews: true,
                    request: {
                        select: {
                            title: true,
                            location: true,
                            proposals: {
                                where: { providerId: userId }, // For pro, get their own proposal
                                select: { message: true, price: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        }

        return NextResponse.json(matches)
    } catch (error) {
        console.error("Error fetching matches:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

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

        if (!req || req.clientId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized or Request not found" }, { status: 403 })
        }

        // 2. Create Match
        const match = await prisma.match.create({
            data: {
                requestId,
                providerId,
                clientId: session.user.id as string
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

        // 6. Send Email Notifications (non-blocking)
        const provider = await prisma.user.findUnique({
            where: { id: providerId },
            select: { name: true, email: true }
        })
        const client = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: { name: true, email: true }
        })

        if (provider && client && provider.email && client.email) {
            // Notify provider
            sendMatchNotification(
                provider.email,
                client.name || "Cliente",
                provider.name || "Profesional",
                req.title,
                match.id
            ).catch(e => console.error("Failed to send match email to provider:", e))

            // Notify client
            sendMatchNotification(
                client.email,
                client.name || "Cliente",
                provider.name || "Profesional",
                req.title,
                match.id
            ).catch(e => console.error("Failed to send match email to client:", e))
        }

        return NextResponse.json(match)
    } catch (error) {
        console.error("Error creating match:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
