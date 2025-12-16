import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * Check if user can create services
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period)
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

  // Check subscription is active WITH 7-day grace period
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null
  const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null

  const subscriptionActive = user.subscriptionStatus === "active" &&
    gracePeriodEnd &&
    gracePeriodEnd > now

  // Allow professionals with active subscription to create services
  // Verification is optional for now - can be enforced later if needed
  return (user.canCreateServices ?? false) && subscriptionActive
}

/**
 * Check if user can receive bookings
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period)
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

  // Check subscription with grace period
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null
  const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null

  const subscriptionActive = user.subscriptionStatus === "active" &&
    gracePeriodEnd &&
    gracePeriodEnd > now

  // Allow professionals with active subscription to receive bookings
  // Verification is optional for now - can be enforced later if needed
  return (user.canReceiveBookings ?? false) && subscriptionActive
}

/**
 * Check if user's listing is visible in search/marketplace
 * Requirements:
 * - PROFESSIONAL role
 * - Active subscription (with 7-day grace period)
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

  // Check subscription with grace period
  const now = new Date()
  const subscriptionEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : null
  const gracePeriodEnd = subscriptionEnd ? new Date(subscriptionEnd.getTime() + 7 * 24 * 60 * 60 * 1000) : null

  const subscriptionActive = user.subscriptionStatus === "active" &&
    gracePeriodEnd &&
    gracePeriodEnd > now

  // Allow professionals with active subscription to have visible listings
  // Verification is optional for now - can be enforced later if needed
  return (user.listingVisible ?? false) && subscriptionActive
}

/**
 * Check if user has active subscription
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

  if (!user) return false

  const now = new Date()
  return user.subscriptionStatus === "active" &&
    user.subscriptionEndsAt &&
    new Date(user.subscriptionEndsAt) > now
}

/**
 * Calculate days remaining in subscription
 * Returns 0 if subscription is expired or not active
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

  if (!user || user.subscriptionStatus !== "active" || !user.subscriptionEndsAt) {
    return 0
  }

  const now = new Date()
  const endDate = new Date(user.subscriptionEndsAt)
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return Math.max(0, daysRemaining)
}

/**
 * Check if user is in grace period (subscription expired but within 7 days)
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

  if (!user || user.subscriptionStatus !== "active" || !user.subscriptionEndsAt) {
    return false
  }

  const now = new Date()
  const endDate = new Date(user.subscriptionEndsAt)
  const gracePeriodEnd = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000)

  return endDate <= now && now <= gracePeriodEnd
}
