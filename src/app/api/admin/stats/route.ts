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

    const [usersByRole, usersBySub, requestsByStatus, verifications, categoryStats] = await Promise.all([
      prisma.user.groupBy({
        by: ["role"],
        _count: true
      }),
      prisma.user.groupBy({
        by: ["subscriptionStatus"],
        _count: true
      }),
      prisma.request.groupBy({
        by: ["status"],
        _count: true
      }),
      prisma.verificationRequest.groupBy({
        by: ["status"],
        _count: true
      }),
      prisma.request.groupBy({
        by: ["categoryId"],
        _count: true,
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      })
    ])

    const totalUsers = usersByRole.reduce((sum, u) => sum + u._count, 0)
    const professionals = usersByRole.find(u => u.role === "PROFESSIONAL")?._count || 0
    const clients = usersByRole.find(u => u.role === "CLIENT")?._count || 0

    // Subscription details
    const activeSubs = usersBySub.find(u => u.subscriptionStatus === "active")?._count || 0
    const trialSubs = usersBySub.find(u => u.subscriptionStatus === "trial")?._count || 0

    const totalRequests = requestsByStatus.reduce((sum, r) => sum + r._count, 0)
    const completedRequests = requestsByStatus.find(r => r.status === "COMPLETED")?._count || 0
    const pendingVerifications = verifications.find(v => v.status === "PENDING")?._count || 0

    // Actual revenue calculation (Active subs * plan price)
    const monthlyPrice = 3900 // From constants
    const estimatedMonthlyRevenue = activeSubs * monthlyPrice

    // Top professionals by completed jobs
    const topPros = await prisma.user.findMany({
      where: {
        role: "PROFESSIONAL",
        matchesAsProvider: {
          some: { isCompleted: true }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        _count: {
          select: {
            matchesAsProvider: {
              where: { isCompleted: true }
            }
          }
        }
      },
      orderBy: {
        matchesAsProvider: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Activity trend (last 7 days registrations)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const registrations = await prisma.user.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        createdAt: true
      }
    })

    // Process registrations into chart data
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = registrations.filter(r =>
        r.createdAt.toISOString().split('T')[0] === dateStr
      ).length

      return {
        date: dateStr,
        count
      }
    }).reverse()

    return NextResponse.json({
      users: {
        total: totalUsers,
        pros: professionals,
        clients: clients,
        activeSubs: activeSubs,
        trialSubs: trialSubs
      },
      requests: {
        total: totalRequests,
        completed: completedRequests,
        conversion: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0
      },
      verifications: {
        pending: pendingVerifications
      },
      categories: categoryStats.map(c => ({
        id: c.categoryId,
        count: c._count
      })),
      topPros: topPros.map(p => ({
        id: p.id,
        name: p.name,
        jobs: p._count.matchesAsProvider,
        avatar: p.avatar
      })),
      activity: chartData,
      revenue: {
        monthly: estimatedMonthlyRevenue
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
