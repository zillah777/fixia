import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Update user's completedOnboarding flag
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { completedOnboarding: true },
        })

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error("Error completing onboarding:", error)
        return NextResponse.json(
            { error: "Error completing onboarding" },
            { status: 500 }
        )
    }
}
