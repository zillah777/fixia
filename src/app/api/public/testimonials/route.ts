import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Mark as dynamic to prevent prerendering during build
export const dynamic = 'force-dynamic'

// Cache testimonials for 5 minutes
export const revalidate = 300

export async function GET() {
    try {
        console.log("[TESTIMONIALS_DEBUG] Starting request")

        const reviews = await prisma.review.findMany({
            where: { score: 5 },
            take: 6,  // Increased from 4 to 6
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        avatar: true,
                        profile: {
                            select: {
                                portfolioImages: true
                            }
                        }
                    }
                }
            }
        })

        console.log("[TESTIMONIALS_DEBUG] Found reviews:", reviews.length)

        const formattedReviews = reviews.map(r => {
            let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author.name)}&background=random&bold=true`

            // Priority 1: Use portfolio image from profile
            if (r.author.profile?.portfolioImages) {
                try {
                    const images = JSON.parse(r.author.profile.portfolioImages)
                    if (Array.isArray(images) && images.length > 0 && images[0]) {
                        avatarUrl = images[0]
                    }
                } catch (e) {
                    console.warn("[TESTIMONIALS_DEBUG] Failed to parse portfolio images:", e)
                }
            }

            // Priority 2: Use user avatar if exists
            if (!avatarUrl && r.author.avatar) {
                avatarUrl = r.author.avatar
            }

            return {
                id: r.id,
                name: r.author.name,
                role: r.author.role === "CLIENT" ? "Cliente Verificado" : "Profesional",
                text: r.comment || "Excelente servicio",
                avatar: avatarUrl,
                rating: r.score
            }
        })

        console.log("[TESTIMONIALS_DEBUG] Formatted reviews:", formattedReviews.length)

        return NextResponse.json(formattedReviews, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
        })
    } catch (error) {
        console.error("[TESTIMONIALS_ERROR] Detailed error:", error)
        if (error instanceof Error) {
            console.error("[TESTIMONIALS_ERROR] Stack:", error.stack)
            console.error("[TESTIMONIALS_ERROR] Message:", error.message)
        }
        // Return empty array instead of error on failure - graceful degradation
        return NextResponse.json([], {
            headers: {
                'Cache-Control': 'public, s-maxage=60'
            }
        })
    }
}
