import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: serviceId } = await params

        // Verify ownership
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 })
        }

        if (service.providerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.service.delete({
            where: { id: serviceId }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Error deleting service:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
