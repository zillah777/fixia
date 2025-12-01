import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 })
        }

        if (notification.userId !== session.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })

        return NextResponse.json(updatedNotification)
    } catch (error) {
        console.error("Error updating notification:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 })
        }

        if (notification.userId !== session.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.notification.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting notification:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
