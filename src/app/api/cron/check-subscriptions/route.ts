import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/check-subscriptions
 * Daily cron job to check expired subscriptions
 * Run via Vercel Cron or external scheduler (e.g., EasyCron)
 *
 * CRON_SECRET env variable must match for security
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    // PHASE 0: Handle expired trials - NO grace period for trials, expire immediately
    const expiredTrials = await prisma.user.findMany({
      where: {
        role: "PROFESSIONAL",
        subscriptionStatus: "trial",
        subscriptionEndsAt: {
          lt: now  // Trial has expired
        }
      }
    })

    console.log(`[CRON] Found ${expiredTrials.length} users with expired trials`)

    // Disable features for expired trials immediately (no grace period)
    let expiredTrialCount = 0
    for (const user of expiredTrials) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "expired",
          canCreateServices: false,
          listingVisible: false,
          canReceiveBookings: false
        }
      })

      // Send notification about trial expiration and need to subscribe
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SUBSCRIPTION",
          message: "Tu período de prueba de 30 días ha finalizado. Para seguir usando Fixia como profesional, debes suscribirte ahora.",
          actionUrl: "/dashboard/subscription/checkout",
          title: "Período de prueba finalizado"
        }
      })

      console.log(`[CRON] Trial expired for user ${user.id}, features disabled`)
      expiredTrialCount++
    }

    // PHASE 1: Send warning emails to professionals with expiring subscriptions (7 days left)
    const expiringUsers = await prisma.user.findMany({
      where: {
        role: "PROFESSIONAL",
        subscriptionStatus: "active",
        subscriptionEndsAt: {
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),  // 7 days from now
          gt: new Date(now.getTime() - 1000)  // Not already expired
        }
      },
      select: { id: true, email: true, name: true, subscriptionEndsAt: true }
    })

    console.log(`[CRON] Found ${expiringUsers.length} users with subscriptions expiring in 7 days`)

    // TODO: Send warning emails via Resend or similar service
    // for (const user of expiringUsers) {
    //   await sendSubscriptionExpiringEmail(user.email, user.name, user.subscriptionEndsAt)
    // }

    // PHASE 2: Handle grace period expiry - disable features after 7-day grace period
    const gracePeriodExpiredUsers = await prisma.user.findMany({
      where: {
        role: "PROFESSIONAL",
        subscriptionStatus: "active",
        subscriptionEndsAt: {
          lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)  // More than 7 days expired
        }
      }
    })

    console.log(`[CRON] Found ${gracePeriodExpiredUsers.length} users with grace period expired`)

    // Disable professional features for grace period expired subscriptions
    let disabledCount = 0
    for (const user of gracePeriodExpiredUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "expired",
          canCreateServices: false,
          listingVisible: false,
          canReceiveBookings: false
        }
      })

      // Send notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          message: "Tu suscripción ha expirado. Tu perfil ya no es visible en búsquedas. Renuévala para seguir ofreciendo servicios.",
          actionUrl: "/dashboard/subscription"
        }
      })

      disabledCount++
    }

    // PHASE 3: Handle subscription cancellations - mark as expired if cancel date has passed
    const cancelledUsers = await prisma.user.findMany({
      where: {
        role: "PROFESSIONAL",
        subscriptionStatus: "cancelled",
        subscriptionCancelledAt: {
          not: null
        }
      },
      select: { id: true, subscriptionEndsAt: true, subscriptionCancelledAt: true }
    })

    console.log(`[CRON] Found ${cancelledUsers.length} users with cancelled subscriptions`)

    // Mark as expired if we're past subscription end date
    let expiredCount = 0
    for (const user of cancelledUsers) {
      if (user.subscriptionEndsAt && new Date(user.subscriptionEndsAt) < now) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "expired",
            canCreateServices: false,
            listingVisible: false,
            canReceiveBookings: false
          }
        })
        expiredCount++
      }
    }

    const summary = {
      success: true,
      timestamp: now.toISOString(),
      stats: {
        expiredTrials: expiredTrialCount,
        expiringInSevenDays: expiringUsers.length,
        gracePeriodExpired: disabledCount,
        cancelledAndExpired: expiredCount
      }
    }

    console.log("[CRON] Subscription check completed:", summary)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("[CRON] Error checking subscriptions:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
