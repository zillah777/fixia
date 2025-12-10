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

        const { id: userId } = await params
        const currentUserId = session.user.id
        const isAdmin = session.user.role === "ADMIN"

        // SECURITY: Ownership validation - only own profile or admin can view sensitive data
        if (userId !== currentUserId && !isAdmin) {
            return NextResponse.json(
                { error: "Forbidden - Cannot access other user profiles" },
                { status: 403 }
            )
        }

        // Fetch user profile with reviews
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true, // Sensitive - only visible to owner or admin
                phone: true, // Sensitive - only visible to owner or admin
                avatar: true,
                role: true,
                profile: {
                    select: {
                        bio: true,
                        badges: true
                    }
                },
                ReviewTarget: {
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
            reviews: user.ReviewTarget
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
