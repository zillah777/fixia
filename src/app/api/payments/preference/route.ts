import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { preference } from "@/lib/mercadopago";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const plan = SUBSCRIPTION_PLANS.PROFESSIONAL;

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: plan.id,
                        title: plan.title,
                        quantity: 1,
                        unit_price: plan.price,
                        currency_id: plan.currency,
                    },
                ],
                payer: {
                    email: session.user.email || "unknown@email.com",
                    name: session.user.name || "Unknown User",
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment=failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment=pending`,
                },
                auto_return: "approved",
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
                metadata: {
                    user_id: session.user.id,
                },
            },
        });

        return NextResponse.json({ init_point: result.init_point });
    } catch (error) {
        console.error("Error creating preference:", error);
        return NextResponse.json(
            { error: "Error creating payment preference" },
            { status: 500 }
        );
    }
}
