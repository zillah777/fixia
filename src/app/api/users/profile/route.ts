import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.payload.id as string },
            include: { profile: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Fetch stats
        const [projectsCount, reviewsCount, favoritesCount] = await Promise.all([
            prisma.request.count({ where: { clientId: user.id } }), // Total requests for client
            prisma.review.count({ where: { targetId: user.id } }),
            prisma.favorite.count({ where: { userId: user.id } })
        ])

        // If professional, add jobs count to projects
        let totalProjects = projectsCount
        if (user.role === 'PROFESSIONAL') {
            const jobsCount = await prisma.match.count({ where: { providerId: user.id, isCompleted: true } })
            totalProjects += jobsCount
        }

        return NextResponse.json({
            ...user,
            stats: {
                projects: totalProjects,
                reviews: reviewsCount,
                favorites: favoritesCount
            }
        })
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, phone, bio, socialLinks, certification, licenseNumber, experience, tags, location } = body

        // Update User and Profile
        const updatedUser = await prisma.user.update({
            where: { id: session.payload.id as string },
            data: {
                name,
                phone,
                profile: {
                    upsert: {
                        create: {
                            bio,
                            socialLinks: JSON.stringify(socialLinks),
                            certification,
                            licenseNumber,
                            experience,
                            tags,
                            trustScore: 0 // Default for new profiles
                        },
                        update: {
                            bio,
                            socialLinks: JSON.stringify(socialLinks),
                            certification,
                            licenseNumber,
                            experience,
                            tags
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
