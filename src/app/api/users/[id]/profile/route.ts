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

        // Fetch user profile with reviews
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
