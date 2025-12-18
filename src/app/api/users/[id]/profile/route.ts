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
        const { id: userId } = await params
        const currentUserId = session?.user?.id
        const isAdmin = session?.user?.role === "ADMIN"
        const isOwnProfile = userId === currentUserId

        // Fetch user profile with reviews
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: isOwnProfile || isAdmin ? true : false, // Sensitive - only visible to owner or admin
                phone: isOwnProfile || isAdmin ? true : false, // Sensitive - only visible to owner or admin
                avatar: true,
                role: true,
                profile: {
                    select: {
                        bio: true,
                        badges: true
                    }
                },
                reviewsReceived: {
                    select: {
                        id: true,
                        score: true,
                        comment: true,
                        createdAt: true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Format response
        const response = {
            ...user,
            reviews: user.reviewsReceived
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
