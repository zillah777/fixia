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

        const { id: requestId } = await params

        const requestData = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        profile: true
                    }
                },
                proposals: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                profile: true
                            }
                        }
                    }
                },
                match: true
            }
        })

        if (!requestData) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        const formattedRequest = {
            ...requestData,
            images: JSON.parse(requestData.images || "[]"),
            tags: JSON.parse(requestData.tags || "[]"),
            client: {
                ...requestData.client,
                profile: requestData.client.profile ? {
                    ...requestData.client.profile,
                    badges: JSON.parse(requestData.client.profile.badges || "[]"),
                    tags: JSON.parse(requestData.client.profile.tags || "[]"),
                    portfolioImages: JSON.parse(requestData.client.profile.portfolioImages || "[]")
                } : null
            },
            proposals: requestData.proposals.map(p => ({
                ...p,
                provider: {
                    ...p.provider,
                    profile: p.provider.profile ? {
                        ...p.provider.profile,
                        badges: JSON.parse(p.provider.profile.badges || "[]"),
                        tags: JSON.parse(p.provider.profile.tags || "[]"),
                        portfolioImages: JSON.parse(p.provider.profile.portfolioImages || "[]")
                    } : null
                }
            }))
        }

        // Check if current user is a provider involved in the request
        if (session.user.role === "PROFESSIONAL") {
            const myProposal = formattedRequest.proposals.find(p => p.providerId === session.user.id);
            if (myProposal) {
                return NextResponse.json({ ...formattedRequest, myProposal });
            }
        }

        return NextResponse.json(formattedRequest)
    } catch (error) {
        console.error("Error fetching request:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
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

        const { id: requestId } = await params

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(requestId)) {
            return NextResponse.json({ error: "Invalid request ID format" }, { status: 400 })
        }

        // Verify ownership - only the request creator (client or professional) or admin can delete
        const requestToDelete = await prisma.request.findUnique({
            where: { id: requestId },
            select: { clientId: true, isDeleted: true }
        })

        if (!requestToDelete) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        // Check if already deleted
        if (requestToDelete.isDeleted) {
            return NextResponse.json({ error: "Request already deleted" }, { status: 410 })
        }

        // SECURITY: Only the request owner (who created it) or admin can delete
        if (requestToDelete.clientId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden - Only the request creator can delete this request" }, { status: 403 })
        }

        // Soft delete: Mark the request as deleted instead of removing it
        // This preserves all associated data (matches, messages, reviews, proposals)
        await prisma.request.update({
            where: { id: requestId },
            data: { isDeleted: true, updatedAt: new Date() }
        })

        return NextResponse.json({ success: true, message: "Request deleted successfully" })
    } catch (error: any) {
        console.error("[DELETE_REQUEST_ERROR]", error);
        console.error("[DELETE_REQUEST_ERROR_DETAILS]", {
            message: error?.message,
            code: error?.code,
            meta: error?.meta
        });
        return NextResponse.json(
            {
                error: "Error al eliminar la solicitud. Intenta nuevamente.",
                message: process.env.NODE_ENV === 'development' ? error?.message : undefined
            },
            { status: 500 }
        )
    }
}
