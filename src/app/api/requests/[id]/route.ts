import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

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

        // Verify ownership - only the request creator (client or professional) or admin can delete
        const requestToDelete = await prisma.request.findUnique({
            where: { id: requestId },
            select: { clientId: true }
        })

        if (!requestToDelete) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        // SECURITY: Only the request owner (who created it) or admin can delete
        if (requestToDelete.clientId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden - Only the request creator can delete this request" }, { status: 403 })
        }

        await prisma.request.delete({
            where: { id: requestId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting request:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
