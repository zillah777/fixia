import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("Error fetching notifications:", error)
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
        const { type, message, actionUrl } = body

        if (!type || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const notification = await prisma.notification.create({
            data: {
                userId: session.id,
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
