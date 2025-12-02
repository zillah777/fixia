import { NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (topic === "payment" && id) {
            const paymentData = await payment.get({ id });

            if (paymentData.status === "approved") {
                const userId = paymentData.metadata.user_id;
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
