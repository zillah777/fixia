import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search") || ""
        const category = searchParams.get("category") || "all"
        const location = searchParams.get("location") || ""

        const whereClause: any = {
            role: "PROFESSIONAL",
            status: "ACTIVE"
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

        const professionals = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
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
                        reviewsReceived: true,
                        matchesAsProvider: { where: { isCompleted: true } }
                    }
                }
            }
        })

        // Transform data to match frontend expectations
        const formattedPros = professionals.map(pro => {
            const tags = JSON.parse(pro.profile?.tags || "[]")
            return {
                id: pro.id,
                name: pro.name,
                role: tags[0] || "Profesional", // Fallback role
                category: pro.services[0]?.categoryId || "General",
                rating: pro.profile?.ratingAvg || 0,
                reviews: pro._count.reviewsReceived,
                location: "Buenos Aires", // Placeholder until we have real address field
                image: `https://ui-avatars.com/api/?name=${pro.name}&background=random`, // Fallback avatar
                price: pro.services[0]?.price ? `$${pro.services[0].price}` : "A convenir",
                verified: true, // Logic for verification?
                tags: tags,
                bio: pro.profile?.bio
            }
        })

        return NextResponse.json(formattedPros)
    } catch (error) {
        console.error("Error fetching professionals:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
