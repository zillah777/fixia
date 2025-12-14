import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

/**
 * GET /api/favorites
 * List user's favorite professionals
 * Requires: Authentication
 */
export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")

        const skip = (page - 1) * limit

        // Get user's favorites with pagination
        const [favorites, total] = await Promise.all([
            prisma.favorite.findMany({
                where: { userId: session.user.id },
                select: {
                    id: true,
                    professionalId: true,
                    createdAt: true,
                    professional: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            profile: {
                                select: {
                                    bio: true,
                                    ratingAvg: true,
                                    tags: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.favorite.count({
                where: { userId: session.user.id }
            })
        ])

        return NextResponse.json({
            data: favorites,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching favorites:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/favorites
 * Add a professional to favorites
 * Requires: Authentication
 * Body: { professionalId: string }
 */
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { professionalId } = body

        if (!professionalId) {
            return NextResponse.json(
                { error: "professionalId is required" },
                { status: 400 }
            )
        }

        // SECURITY: Verify user doesn't favorite themselves
        if (professionalId === session.user.id) {
            return NextResponse.json(
                { error: "Cannot favorite yourself" },
                { status: 400 }
            )
        }

        // SECURITY: Verify professional exists and is actually a professional
        const professional = await prisma.user.findUnique({
            where: { id: professionalId },
            select: { id: true, role: true }
        })

        if (!professional) {
            return NextResponse.json(
                { error: "Professional not found" },
                { status: 404 }
            )
        }

        if (professional.role !== "PROFESSIONAL") {
            return NextResponse.json(
                { error: "User is not a professional" },
                { status: 400 }
            )
        }

        // SECURITY: Check if already favorited (handled by unique constraint, but catch error)
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_professionalId: {
                    userId: session.user.id,
                    professionalId
                }
            }
        })

        if (existingFavorite) {
            return NextResponse.json(
                { error: "Already in favorites" },
                { status: 409 }
            )
        }

        // Create favorite
        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                professionalId
            },
            select: {
                id: true,
                createdAt: true,
                professional: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        })

        return NextResponse.json(favorite, { status: 201 })
    } catch (error) {
        console.error("Error creating favorite:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
