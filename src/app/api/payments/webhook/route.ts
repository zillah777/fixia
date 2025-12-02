import { NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";

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
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            subscriptionStatus: "active",
                            subscriptionPlan: "professional_monthly",
                            subscriptionId: paymentData.id?.toString(),
                            subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                            role: "PROFESSIONAL", // Ensure role is updated/enforced
                        }
                    });

                    // Also verify the profile if it exists
                    await prisma.profile.updateMany({
                        where: { userId: userId },
                        data: {
                            badges: JSON.stringify(["VERIFIED", "PREMIUM"]) // Add badges
                        }
                    });
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
