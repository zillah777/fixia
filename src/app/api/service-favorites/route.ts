import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

/**
 * GET /api/service-favorites
 * List user's favorite services
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

        // Get user's service favorites with pagination
        const [favorites, total] = await Promise.all([
            prisma.serviceFavorite.findMany({
                where: { userId: session.user.id },
                select: {
                    id: true,
                    serviceId: true,
                    createdAt: true,
                    service: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            price: true,
                            images: true,
                            tags: true,
                            categoryId: true,
                            provider: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true,
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.serviceFavorite.count({
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
        console.error("Error fetching service favorites:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/service-favorites
 * Add a service to favorites
 * Requires: Authentication
 * Body: { serviceId: string }
 */
export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { serviceId } = body

        if (!serviceId) {
            return NextResponse.json(
                { error: "serviceId is required" },
                { status: 400 }
            )
        }

        // SECURITY: Verify service exists
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { id: true, providerId: true }
        })

        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            )
        }

        // SECURITY: Verify user doesn't favorite their own service
        if (service.providerId === session.user.id) {
            return NextResponse.json(
                { error: "Cannot favorite your own service" },
                { status: 400 }
            )
        }

        // SECURITY: Check if already favorited
        const existingFavorite = await prisma.serviceFavorite.findUnique({
            where: {
                userId_serviceId: {
                    userId: session.user.id,
                    serviceId
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
        const favorite = await prisma.serviceFavorite.create({
            data: {
                userId: session.user.id,
                serviceId
            },
            select: {
                id: true,
                createdAt: true,
                service: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            }
        })

        return NextResponse.json(favorite, { status: 201 })
    } catch (error) {
        console.error("Error creating service favorite:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
