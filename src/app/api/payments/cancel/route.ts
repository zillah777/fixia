import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // In a real production environment with MercadoPago, we would also need to
        // cancel the preapproval/plan via their API here.
        // For now, we update the local DB status.
        // We do NOT set subscriptionStatus to 'cancelled' immediately if we want them to keep access until the end.
        // However, the user request says "Una vez que venza no se cobra mas".
        // So we might set a 'cancelled_at_period_end' flag or similar, OR just trust 'subscriptionEndsAt'
        // and when the webhook comes for renewal, if it fails (because we cancelled it in MP), it will expire.

        // Simpler approach for this iteration:
        // Set status to 'cancelled' but logic elsewhere checks subscriptionEndsAt.
        // Wait, if status is 'active', the middleware allows access.
        // If status is 'cancelled', the middleware check: user.subscriptionStatus === "active"
        // This would block them immediately!
        // The user said: "una vez que venza no se cobra mas, y regresa a estado Cliente".
        // This implies they KEEP access until it expires.

        // So we should probably keep status 'active' but maybe mark 'autoRenew: false'?
        // The schema doesn't have autoRenew.
        // Let's check how the middleware checks access:
        // (!isSubscriptionActive || !hasValidSubscription)
        // isSubscriptionActive = user.subscriptionStatus === "active"
        // hasValidSubscription = user.subscriptionEndsAt > now

        // If we change status to 'cancelled', they lose access immediately because of isSubscriptionActive check.
        // We should update the middleware logic OR introduce a new status like 'cancelling'.
        // OR we just rely on subscriptionEndsAt.
        // But the middleware requires BOTH 'active' AND 'valid date'.

        // Workaround: Keep status 'active' but we need a way to know it's cancelled to show in UI.
        // Let's add 'cancelled' status but update middleware to allow 'cancelled' IF date is valid.

        // Let's update the status to 'cancelled' here.

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                subscriptionStatus: "cancelled"
            }
        });

        // Note: The middleware will need to be updated to allow 'cancelled' status if the date is still valid.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return NextResponse.json({ error: "Error cancelling subscription" }, { status: 500 });
    }
}
