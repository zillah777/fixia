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

        return NextResponse.json(user)
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
        const { name, bio, socialLinks } = body

        // Update User and Profile
        const updatedUser = await prisma.user.update({
            where: { id: session.payload.id as string },
            data: {
                name,
                profile: {
                    upsert: {
                        create: {
                            bio,
                            socialLinks: JSON.stringify(socialLinks),
                            trustScore: 0 // Default for new profiles
                        },
                        update: {
                            bio,
                            socialLinks: JSON.stringify(socialLinks)
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
