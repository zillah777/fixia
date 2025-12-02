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

        return NextResponse.json(formattedRequest)
    } catch (error) {
        console.error("Error fetching request:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
