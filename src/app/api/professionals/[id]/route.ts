import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        const pro = await prisma.user.findUnique({
            where: { id, role: "PROFESSIONAL" },
            include: {
                profile: true,
                services: true,
                reviewsReceived: {
                    include: {
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

        const formattedPro = {
            id: pro.id,
            name: pro.name,
            role: tags[0] || "Profesional",
            rating: pro.profile?.ratingAvg || 0,
            reviewsCount: pro._count.reviewsReceived,
            location: "Buenos Aires", // Placeholder
            image: `https://ui-avatars.com/api/?name=${pro.name}&background=random`,
            bio: pro.profile?.bio || "Sin biografía.",
            verified: true,
            joinedDate: pro.createdAt.toLocaleDateString(),
            skills: tags,
            portfolio: portfolioImages,
            reviews: pro.reviewsReceived.map(r => ({
                id: r.id,
                user: r.author.name,
                rating: r.score,
                comment: r.comment,
                date: r.createdAt.toLocaleDateString()
            })),
            services: pro.services.map(s => ({
                ...s,
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
