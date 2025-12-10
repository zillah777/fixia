import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id: proposalId } = await params

        // Verify ownership - only the professional who created the proposal can delete it
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            select: { providerId: true }
        })

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
        }

        // SECURITY: Only the proposal creator (professional) or admin can delete
        if (proposal.providerId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({
                error: "Forbidden - Only the professional who created this proposal can delete it"
            }, { status: 403 })
        }

        await prisma.proposal.delete({
            where: { id: proposalId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting proposal:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
