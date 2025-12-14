import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get("role") || "CLIENT"
        const search = searchParams.get("search") || ""
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            role: role.toUpperCase(),
            status: "ACTIVE"
        }

        // Add search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ]
        }

        // Fetch users with pagination
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                    profile: {
                        select: {
                            bio: true,
                            ratingAvg: true,
                            badges: true,
                            locationLat: true,
                            locationLng: true
                        }
                    },
                    _count: {
                        select: {
                            reviewsReceived: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
