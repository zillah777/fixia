import prisma from "@/lib/prisma"
import { sendNotification } from "@/lib/web-push"

interface NotificationPayload {
    userId: string
    type: string // "NEW_PROPOSAL" | "MATCH_UPDATE" | "NEW_REVIEW" | "LEAD_GEN" | "SYSTEM"
    title: string
    message: string
    actionUrl?: string
    metadata?: any
}

/**
 * Centralized helper to send notifications via DB (Dashboard) and Web Push.
 * usage: await notifyUser({ userId: "...", type: "...", title: "...", message: "..." })
 */
export async function notifyUser({
    userId,
    type,
    title,
    message,
    actionUrl,
    metadata
}: NotificationPayload) {
    try {
        // 1. Create Dashboard Notification (Persist in DB)
        // Note: Prisma schema for Notification might not have 'title', usually it has 'message'.
        // We will prepend title to message if needed or just use message.
        // Checking schema: id, userId, type, message, isRead, actionUrl. No title.

        await prisma.notification.create({
            data: {
                userId,
                type,
                message: message, // or `${title}: ${message}` depending on preference
                actionUrl,
                // metadata could be stored if schema supported it, currently it doesn't seem to.
            }
        })

        // 2. Send Web Push Notification to all active subscriptions
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        })

        if (subscriptions.length > 0) {
            const payload = JSON.stringify({
                title,
                body: message,
                url: actionUrl,
                data: { ...metadata, url: actionUrl }
            })

            const promises = subscriptions.map(sub => {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                }
                return sendNotification(pushSubscription, payload)
            })

            await Promise.allSettled(promises)
        }

        return true
    } catch (error) {
        console.error("[NOTIFICATIONS] Error sending notification:", error)
        // Don't crash the main flow if notification fails
        return false
    }
}
