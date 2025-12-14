import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/favorites/[id]
 * Remove a professional from favorites
 * Requires: Authentication + Ownership
 */
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

        // SECURITY: Verify favorite exists and belongs to current user
        const favorite = await prisma.favorite.findUnique({
            where: { id },
            select: { userId: true }
        })

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
        }

        if (favorite.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        // Delete favorite
        await prisma.favorite.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting favorite:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
