import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession, encrypt, setSessionCookie } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            include: {
                profile: true,
                verificationRequest: true,
                reviewsReceived: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                avatar: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
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
        const { name, phone, bio, socialLinks, certification, licenseNumber, experience, tags, location, portfolioImages } = body

        // Update User and Profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id as string },
            data: {
                name,
                avatar: body.avatar, // Allow updating avatar
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
                            tags,
                            notificationSettings: body.notificationSettings ? JSON.stringify(body.notificationSettings) : undefined, // Check if provided
                            portfolioImages: portfolioImages ? JSON.stringify(portfolioImages) : undefined // Update portfolio images
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        })

        const newSession = {
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            },
        }

        const token = await encrypt(newSession)
        const response = NextResponse.json(updatedUser)
        await setSessionCookie(token, response)

        return response
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
