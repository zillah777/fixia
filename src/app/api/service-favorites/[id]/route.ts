import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/service-favorites/[id]
 * Remove a service from favorites
 * Requires: Authentication & Ownership
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

        const { id: favoriteId } = await params

        // Verify ownership
        const favorite = await prisma.serviceFavorite.findUnique({
            where: { id: favoriteId },
            select: { userId: true }
        })

        if (!favorite) {
            return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
        }

        // SECURITY: Only the owner can delete
        if (favorite.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: "Forbidden - Only the owner can delete this favorite" },
                { status: 403 }
            )
        }

        // Delete favorite
        await prisma.serviceFavorite.delete({
            where: { id: favoriteId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting service favorite:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
