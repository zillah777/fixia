import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
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
                                // Assuming avatar is a field in Profile based on previous context, 
                                // but schema says 'portfolioImages'. 
                                // Wait, schema line 91: portfolioImages String[]
                                // Schema line 87: Profile model...
                                // I don't see 'avatar' in Profile model in the schema I just read!
                                // Let me check schema again.
                                // Line 42 User model...
                                // Line 87 Profile model...
                                // It seems 'avatar' is MISSING from Profile in the schema I read?
                                // Let me re-read schema carefully.
                                // Line 91: portfolioImages String[]
                                // Line 94: ratingAvg Float
                                // Line 95: badges String[]
                                // Line 96: socialLinks String?
                                // Line 97: trustScore Int
                                // Line 100: certification String?
                                // ...
                                // I DO NOT SEE AVATAR!
                                // It might be on User? No.
                                // Wait, in previous steps I might have assumed it or it was there.
                                // Let's check if I missed it.
                                // If it's missing, I should add it or use a placeholder.
                                // For now, I will remove avatar from select and use default.
                            }
                        }
                    }
                }
            }
        })

        const formattedReviews = reviews.map(r => ({
            id: r.id,
            name: r.author.name,
            role: r.author.role === "CLIENT" ? "Cliente Verificado" : "Profesional",
            text: r.comment,
            avatar: "/avatars/default.png", // Fallback since avatar field is missing
            rating: r.score
        }))

        return NextResponse.json(formattedReviews)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching testimonials" }, { status: 500 })
    }
}
