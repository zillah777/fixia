import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, phone, location, bio, avatar } = body

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            )
        }

        // Update user
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone: phone || null,
                location: location || null,
                avatar: avatar || null,
            },
        })

        // Update profile if professional
        if (session.user.role === "PROFESSIONAL") {
            await prisma.profile.upsert({
                where: { userId: session.user.id },
                create: {
                    userId: session.user.id,
                    bio: bio || null,
                },
                update: {
                    bio: bio || null,
                },
            })
        }

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json(
            { error: "Error updating profile" },
            { status: 500 }
        )
    }
}
