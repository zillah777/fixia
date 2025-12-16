import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [users, requests, verifications] = await Promise.all([
      prisma.user.groupBy({
        by: ["role"],
        _count: true
      }),
      prisma.request.groupBy({
        by: ["status"],
        _count: true
      }),
      prisma.verificationRequest.groupBy({
        by: ["status"],
        _count: true
      })
    ])

    const totalUsers = users.reduce((sum, u) => sum + u._count, 0)
    const professionals = users.find(u => u.role === "PROFESSIONAL")?._count || 0
    const clients = users.find(u => u.role === "CLIENT")?._count || 0
    const totalRequests = requests.reduce((sum, r) => sum + r._count, 0)
    const completedRequests = requests.find(r => r.status === "COMPLETED")?._count || 0
    const pendingVerifications = verifications.find(v => v.status === "PENDING")?._count || 0

    return NextResponse.json({
      users: {
        total: totalUsers,
        pros: professionals,
        clients: clients
      },
      requests: {
        total: totalRequests,
        completed: completedRequests
      },
      verifications: {
        pending: pendingVerifications
      },
      revenue: {
        total: 0
      }
    })
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
