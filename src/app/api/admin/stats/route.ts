import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session || session.payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const [
            totalUsers,
            totalPros,
            totalRequests,
            completedRequests,
            pendingVerifications,
            revenue
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "PROFESSIONAL" } }),
            prisma.request.count(),
            prisma.request.count({ where: { status: "COMPLETED" } }),
            prisma.verificationRequest.count({ where: { status: "PENDING" } }),
            // Mock revenue calculation (e.g., active subscriptions * price)
            prisma.user.count({ where: { subscriptionStatus: "active" } }).then(count => count * 4999)
        ])

        return NextResponse.json({
            users: {
                total: totalUsers,
                pros: totalPros,
                clients: totalUsers - totalPros
            },
            requests: {
                total: totalRequests,
                completed: completedRequests,
                open: totalRequests - completedRequests
            },
            verifications: {
                pending: pendingVerifications
            },
            revenue: {
                total: revenue
            }
        })
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
