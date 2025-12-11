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

        const body = await request.json()
        const { planId } = body

        if (!planId) {
            return NextResponse.json(
                { error: "Plan ID is required" },
                { status: 400 }
            )
        }

        // Validate plan ID
        const validPlans = ["basic", "pro", "premium"]
        if (!validPlans.includes(planId)) {
            return NextResponse.json(
                { error: "Invalid plan ID" },
                { status: 400 }
            )
        }

        // For free plan (basic), just set the subscription
        if (planId === "basic") {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    subscriptionPlan: "basic",
                    subscriptionStatus: "active",
                    canCreateServices: true,
                    listingVisible: true,
                    canReceiveBookings: true,
                },
            })

            return NextResponse.json({ success: true })
        }

        // For paid plans, would normally integrate with payment processor
        // For now, just store the plan selection
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                subscriptionPlan: planId,
                subscriptionStatus: "pending_payment",
            },
        })

        return NextResponse.json({
            success: true,
            message: "Plan selected. Proceed to payment.",
            planId,
        })
    } catch (error) {
        console.error("Error selecting plan:", error)
        return NextResponse.json(
            { error: "Error selecting plan" },
            { status: 500 }
        )
    }
}
