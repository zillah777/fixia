import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * GET /api/notifications
 * List user's notifications with optional filtering
 * Query params: isRead (filter), limit (default 20)
 */
export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const isRead = searchParams.get("isRead")
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)

        const where: any = { userId: session.user.id }
        if (isRead !== null) {
            where.isRead = isRead === "true"
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * PATCH /api/notifications?action=mark-all-read
 * Bulk mark notifications as read
 */
export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const action = searchParams.get("action")

        if (action === "mark-all-read") {
            const result = await prisma.notification.updateMany({
                where: {
                    userId: session.user.id,
                    isRead: false
                },
                data: { isRead: true }
            })

            return NextResponse.json({
                success: true,
                updated: result.count
            })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Error updating notifications:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * DELETE /api/notifications?action=delete-all-read
 * Bulk delete read notifications
 */
export async function DELETE(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const action = searchParams.get("action")

        if (action === "delete-all-read") {
            const result = await prisma.notification.deleteMany({
                where: {
                    userId: session.user.id,
                    isRead: true
                }
            })

            return NextResponse.json({
                success: true,
                deleted: result.count
            })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Error deleting notifications:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * POST /api/notifications
 * Create a new notification (for admin or system use)
 */
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { type, message, actionUrl } = body

        if (!type || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const notification = await prisma.notification.create({
            data: {
                userId: session.user.id,
                type,
                message,
                actionUrl
            }
        })

        return NextResponse.json(notification)
    } catch (error) {
        console.error("Error creating notification:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
