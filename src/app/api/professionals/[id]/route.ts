import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

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
                location: true, // Added location
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

        let portfolioImages = []
        try {
            const parsed = JSON.parse(pro.profile?.portfolioImages || "[]")
            if (Array.isArray(parsed)) {
                portfolioImages = parsed
            } else if (typeof parsed === 'string') {
                // Handle potential double-encoding
                try {
                    const doubleParsed = JSON.parse(parsed)
                    if (Array.isArray(doubleParsed)) {
                        portfolioImages = doubleParsed
                    }
                } catch (e) {
                    console.warn("Failed to double-parse portfolioImages", e)
                }
            }
        } catch (e) {
            console.error("Error parsing portfolioImages", e)
        }

        const badges = JSON.parse(pro.profile?.badges || "[]")

        // Calculate verified status
        const isVerified = pro.verificationRequest?.status === "APPROVED"

        // Check if user has favorited this professional
        let isFavorite = false
        let favoriteId = null

        const session = await getSession()
        if (session && session.user) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_professionalId: {
                        userId: session.user.id,
                        professionalId: pro.id
                    }
                },
                select: { id: true }
            })
            if (favorite) {
                isFavorite = true
                favoriteId = favorite.id
            }
        }

        // Calculate rating dynamically if needed
        let rating = pro.profile?.ratingAvg || 0;
        if ((!rating || rating === 0) && pro.reviewsReceived.length > 0) {
            const total = pro.reviewsReceived.reduce((acc, review) => acc + review.score, 0);
            rating = total / pro.reviewsReceived.length;
        }

        const formattedPro = {
            id: pro.id,
            name: pro.name,
            role: tags[0] || "Profesional",
            rating: rating,
            reviewsCount: pro._count.reviewsReceived,
            location: pro.location || "Ubicación no disponible",
            image: pro.avatar, // Let getAvatarUrl handle nulls in frontend if raw usage
            bio: pro.profile?.bio || "Sin biografía.",
            verified: isVerified,
            isFavorite,
            favoriteId,
            joinedDate: pro.createdAt.toLocaleDateString(),
            skills: tags,
            portfolio: portfolioImages,
            badges: badges,
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
