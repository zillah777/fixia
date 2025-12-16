import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const category = searchParams.get("category") || "all"
        const location = searchParams.get("location") || ""

        // PERFORMANCE: Add pagination support
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
        const skip = (page - 1) * limit

        const whereClause: any = {
            role: "PROFESSIONAL",
            status: "ACTIVE",
            listingVisible: true,  // Only show professionals with active listings
            subscriptionStatus: "active",  // Only show active subscriptions
            subscriptionEndsAt: {
                gt: new Date()  // Subscription not expired
            }
        }

        // Search filter (Name, Bio, Tags)
        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { profile: { bio: { contains: search } } },
                { profile: { tags: { contains: search } } }
            ]
        }

        // Category filter (Check if any service matches the category)
        if (category && category !== "all") {
            whereClause.services = {
                some: {
                    categoryId: { equals: category }
                }
            }
        }

        // Location filter (Simple string match in bio as fallback)
        if (location) {
            whereClause.profile = {
                ...whereClause.profile,
                bio: { contains: location }
            }
        }

        console.log("[PROFESSIONALS_API] Fetching with filters:", { search, category, location, page, limit, skip })

        // PERFORMANCE: Use Promise.all to run count and findMany in parallel
        const [professionals, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    role: true,
                    createdAt: true,
                    subscriptionStatus: true,
                    verificationRequest: {
                        select: { status: true }
                    },
                    profile: {
                        select: {
                            bio: true,
                            ratingAvg: true,
                            tags: true,
                            portfolioImages: true,
                            locationLat: true,
                            locationLng: true,
                            experience: true,
                            certification: true
                        }
                    },
                    services: {
                        select: {
                            id: true,
                            title: true,
                            categoryId: true,
                            price: true
                        }
                    },
                    _count: {
                        select: {
                            matchesAsProvider: { where: { isCompleted: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where: whereClause })
        ])

        console.log("[PROFESSIONALS_API] Found", professionals.length, "professionals out of", total)

        // Return data in the format expected by frontend
        const formattedPros = professionals.map(pro => ({
            id: pro.id,
            name: pro.name,
            avatar: pro.avatar,
            role: pro.services.length > 0
                ? Array.from(new Set(pro.services.map(s => s.categoryId))).join(", ")
                : "Profesional",
            location: "Buenos Aires, Argentina", // Placeholder
            price: pro.services.length > 0
                ? `Desde ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Math.min(...pro.services.map(s => Number(s.price))))}`
                : "A consultar",
            rating: pro.profile?.ratingAvg || 0,
            reviews: pro._count.matchesAsProvider || 0,
            verified: pro.verificationRequest?.status === 'APPROVED',
            tags: pro.profile?.tags ? JSON.parse(pro.profile.tags) : [],
            profile: {
                bio: pro.profile?.bio,
                locationLat: pro.profile?.locationLat,
                locationLng: pro.profile?.locationLng,
                ratingAvg: pro.profile?.ratingAvg || 0,
                badges: pro.profile?.tags ? JSON.parse(pro.profile.tags) : []
            },
            _count: {
                reviewsReceived: pro._count.matchesAsProvider || 0
            }
        }))

        // Return paginated response
        return NextResponse.json({
            data: formattedPros,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching professionals:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
