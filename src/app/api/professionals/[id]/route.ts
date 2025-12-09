import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        // SECURITY: Use selective select to avoid over-fetching sensitive data
        const pro = await prisma.user.findUnique({
            where: { id, role: "PROFESSIONAL" },
            select: {
                id: true,
                name: true,
                avatar: true,
                createdAt: true,
                profile: {
                    select: {
                        bio: true,
                        ratingAvg: true,
                        tags: true,
                        badges: true,
                        portfolioImages: true
                    }
                },
                services: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                        images: true,
                        tags: true
                    }
                },
                verificationRequest: {
                    select: {
                        status: true
                    }
                },
                reviewsReceived: {
                    select: {
                        id: true,
                        score: true,
                        comment: true,
                        createdAt: true,
                        author: {
                            select: { name: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: {
                        reviewsReceived: true,
                        matchesAsProvider: { where: { isCompleted: true } }
                    }
                }
            }
        })

        if (!pro) {
            return NextResponse.json({ error: "Professional not found" }, { status: 404 })
        }

        // Transform data
        const tags = JSON.parse(pro.profile?.tags || "[]")
        const portfolioImages = JSON.parse(pro.profile?.portfolioImages || "[]")
        const badges = JSON.parse(pro.profile?.badges || "[]")

        // Calculate verified status
        const isVerified = pro.verificationRequest?.status === "APPROVED"

        const formattedPro = {
            id: pro.id,
            name: pro.name,
            role: tags[0] || "Profesional",
            rating: pro.profile?.ratingAvg || 0,
            reviewsCount: pro._count.reviewsReceived,
            location: "Buenos Aires", // Placeholder as location is not yet in DB schema
            image: pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`,
            bio: pro.profile?.bio || "Sin biografía.",
            verified: isVerified,
            joinedDate: pro.createdAt.toLocaleDateString(),
            skills: tags,
            portfolio: portfolioImages,
            badges: badges, // Return badges
            reviews: pro.reviewsReceived.map(r => ({
                id: r.id,
                user: r.author.name,
                rating: r.score,
                comment: r.comment,
                date: r.createdAt.toLocaleDateString()
            })),
            services: pro.services.map(s => ({
                id: s.id,
                title: s.title,
                description: s.description,
                price: s.price,
                images: JSON.parse(s.images || "[]"),
                tags: JSON.parse(s.tags || "[]")
            }))
        }

        return NextResponse.json(formattedPro)
    } catch (error) {
        console.error("Error fetching professional:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
