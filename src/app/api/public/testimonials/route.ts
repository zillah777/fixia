import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        console.log("[TESTIMONIALS_DEBUG] Starting request")
        await prisma.$connect()
        console.log("[TESTIMONIALS_DEBUG] Connected to DB")
        const reviews = await prisma.review.findMany({
            where: { score: 5 },
            take: 4,
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        name: true,
                        role: true,
                        profile: {
                            select: {
                                portfolioImages: true
                            }
                        }
                    }
                }
            }
        })

        const formattedReviews = reviews.map(r => {
            // Try to get the first portfolio image as avatar, otherwise default
            let avatarUrl = "/avatars/default.png"
            if (r.author.profile?.portfolioImages) {
                try {
                    const images = JSON.parse(r.author.profile.portfolioImages)
                    if (Array.isArray(images) && images.length > 0) {
                        avatarUrl = images[0]
                    }
                } catch (e) {
                    // Ignore parsing error
                }
            }

            return {
                id: r.id,
                name: r.author.name,
                role: r.author.role === "CLIENT" ? "Cliente Verificado" : "Profesional",
                text: r.comment,
                avatar: avatarUrl,
                rating: r.score
            }
        })

        return NextResponse.json(formattedReviews)
    } catch (error) {
        console.error("[TESTIMONIALS_ERROR] Detailed error:", error)
        if (error instanceof Error) {
            console.error("[TESTIMONIALS_ERROR] Stack:", error.stack)
            console.error("[TESTIMONIALS_ERROR] Message:", error.message)
        }
        return NextResponse.json({ error: "Error fetching testimonials", details: String(error) }, { status: 500 })
    }
}
