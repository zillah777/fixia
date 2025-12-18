import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * Check if user can create services
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period) OR Trial subscription (no grace period)
 * - Identity verified (VERIFIED badge)
 */
export async function canUserCreateServices(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      canCreateServices: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      profile: {
        select: {
          badges: true
        }
      }
    }
  })

  if (!user || user.role !== "PROFESSIONAL") return false

  // Check if user is verified
  let badges: string[] = []
  try {
    badges = JSON.parse(user.profile?.badges || "[]")
  } catch (e) {
    console.error("Error parsing badges:", e)
  }
  const isVerified = badges.includes("VERIFIED")

  // Check subscription status
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null

  let subscriptionActive = false

  // Trial subscription (no grace period - expires immediately)
  if (user.subscriptionStatus === "trial") {
    subscriptionActive = subscriptionEnd !== null && subscriptionEnd > now
  }
  // Active subscription (with 7-day grace period)
  else if (user.subscriptionStatus === "active") {
    const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null
    subscriptionActive = gracePeriodEnd !== null && gracePeriodEnd > now
  }

  // Allow professionals with active subscription to create services
  // Verification is optional for now - can be enforced later if needed
  return (user.canCreateServices ?? false) && subscriptionActive
}

/**
 * Check if user can receive bookings
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period) OR Trial subscription (no grace period)
 * - Identity verified (VERIFIED badge)
 */
export async function canUserReceiveBookings(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      canReceiveBookings: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      profile: {
        select: {
          badges: true
        }
      }
    }
  })

  if (!user || user.role !== "PROFESSIONAL") return false

  // Check if user is verified
  let badges: string[] = []
  try {
    badges = JSON.parse(user.profile?.badges || "[]")
  } catch (e) {
    console.error("Error parsing badges:", e)
  }
  const isVerified = badges.includes("VERIFIED")

  // Check subscription status
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null

  let subscriptionActive = false

  // Trial subscription (no grace period - expires immediately)
  if (user.subscriptionStatus === "trial") {
    subscriptionActive = subscriptionEnd !== null && subscriptionEnd > now
  }
  // Active subscription (with 7-day grace period)
  else if (user.subscriptionStatus === "active") {
    const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null
    subscriptionActive = gracePeriodEnd !== null && gracePeriodEnd > now
  }

  // Allow professionals with active subscription to receive bookings
  // Verification is optional for now - can be enforced later if needed
  return (user.canReceiveBookings ?? false) && subscriptionActive
}

/**
 * Check if user's listing is visible in search/marketplace
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period) OR Trial subscription (no grace period)
 * - Identity verified (VERIFIED badge)
 */
export async function isUserListingVisible(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      listingVisible: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      profile: {
        select: {
          badges: true
        }
      }
    }
  })

  if (!user || user.role !== "PROFESSIONAL") return false

  // Check if user is verified
  let badges: string[] = []
  try {
    badges = JSON.parse(user.profile?.badges || "[]")
  } catch (e) {
    console.error("Error parsing badges:", e)
  }
  const isVerified = badges.includes("VERIFIED")

  // Check subscription status
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null

  let subscriptionActive = false

  // Trial subscription (no grace period - expires immediately)
  if (user.subscriptionStatus === "trial") {
    subscriptionActive = subscriptionEnd !== null && subscriptionEnd > now
  }
  // Active subscription (with 7-day grace period)
  else if (user.subscriptionStatus === "active") {
    const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null
    subscriptionActive = gracePeriodEnd !== null && gracePeriodEnd > now
  }

  // Allow professionals with active subscription to have visible listings
  // Verification is optional for now - can be enforced later if needed
  return (user.listingVisible ?? false) && subscriptionActive
}

/**
 * Check if user has active subscription
 * Includes both "active" (with grace period) and "trial" (without grace period) statuses
 * Used for displaying subscription status in UI
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true
    }
  })

  if (!user || !user.subscriptionEndsAt) return false

  const now = new Date()
  const subscriptionEnd = new Date(user.subscriptionEndsAt)

  // Trial subscription (no grace period)
  if (user.subscriptionStatus === "trial") {
    return subscriptionEnd > now
  }

  // Active subscription (with 7-day grace period)
  if (user.subscriptionStatus === "active") {
    const gracePeriodEnd = new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000)
    return gracePeriodEnd > now
  }

  return false
}

/**
 * Calculate days remaining in subscription
 * Returns 0 if subscription is expired or not active
 * Works for both "trial" and "active" subscription statuses
 */
export async function getSubscriptionDaysRemaining(): Promise<number> {
  const session = await getSession()
  if (!session) return 0

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true
    }
  })

  if (!user || !user.subscriptionEndsAt) {
    return 0
  }

  // Only calculate for trial or active subscriptions
  if (user.subscriptionStatus !== "trial" && user.subscriptionStatus !== "active") {
    return 0
  }

  const now = new Date()
  const endDate = new Date(user.subscriptionEndsAt)
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, daysRemaining)
}

/**
 * Check if user is in grace period (subscription expired but within 7 days)
 * Only applies to "active" subscriptions - "trial" has no grace period
 */
export async function isInGracePeriod(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true
    }
  })

  // Grace period only applies to "active" subscriptions, not "trial"
  if (!user || user.subscriptionStatus !== "active" || !user.subscriptionEndsAt) {
    return false
  }

  const now = new Date()
  const endDate = new Date(user.subscriptionEndsAt)
  const gracePeriodEnd = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000)

  return endDate <= now && now <= gracePeriodEnd
}
