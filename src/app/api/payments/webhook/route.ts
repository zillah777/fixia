import { NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (topic === "payment" && id) {
            const paymentData = await payment.get({ id });

            if (paymentData.status === "approved") {
                const userId = paymentData.metadata.user_id;

                if (userId) {
                    const subscriptionEndDate = new Date();
                    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30); // 30 days subscription

                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            subscriptionStatus: "active",
                            subscriptionPlan: "professional_monthly",
                            subscriptionEndsAt: subscriptionEndDate,
                            status: "ACTIVE", // Ensure account is active
                            subscriptionId: paymentData.id?.toString(),

                            // ENABLE PROFESSIONAL FEATURES
                            canCreateServices: true,
                            listingVisible: true,
                            canReceiveBookings: true,
                            lastRenewalAt: new Date(),
                            nextBillingDate: subscriptionEndDate
                        }
                    });

                    console.log(`Subscription activated for user ${userId}`);
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
