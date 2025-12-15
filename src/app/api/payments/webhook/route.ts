import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { payment } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

/**
 * Validates MercadoPago webhook signature using HMAC-SHA256
 * Prevents unauthorized webhook requests
 * Reference: https://developers.mercadopago.com/en/docs/webhooks/additional-content/security
 */
function validateWebhookSignature(
    requestBody: string,
    signature: string | null,
    secret: string
): boolean {
    if (!signature) {
        console.error("[WEBHOOK] Missing x-signature header");
        return false;
    }

    try {
        // Parse signature format: "ts=<timestamp>,v1=<hash>"
        const parts = signature.split(",");
        const timestamp = parts[0]?.split("=")[1];
        const hash = parts[1]?.split("=")[1];

        if (!timestamp || !hash) {
            console.error("[WEBHOOK] Invalid signature format");
            return false;
        }

        // Create HMAC-SHA256 hash
        const data = `${timestamp}.${requestBody}`;
        const computedHash = createHmac("sha256", secret)
            .update(data)
            .digest("hex");

        // Constant-time comparison to prevent timing attacks
        const isValid = computedHash === hash;

        if (!isValid) {
            console.error("[WEBHOOK] Signature verification failed");
        }

        return isValid;
    } catch (error) {
        console.error("[WEBHOOK] Signature validation error:", error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        // SECURITY: Validate webhook signature BEFORE processing
        const signature = request.headers.get("x-signature");
        const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("[WEBHOOK] MERCADOPAGO_WEBHOOK_SECRET not configured");
            return NextResponse.json(
                { error: "Webhook configuration missing" },
                { status: 500 }
            );
        }

        // Get raw body for signature validation
        const bodyText = await request.text();

        // Validate signature - reject if invalid
        if (!validateWebhookSignature(bodyText, signature, webhookSecret)) {
            console.error("[WEBHOOK] Signature validation failed - REJECTING REQUEST");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse body after validation
        const body = JSON.parse(bodyText);
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        // Process payment events only after signature validation
        if (topic === "payment" && id) {
            // Verify payment ID matches request parameter (prevent parameter manipulation)
            if (body.data?.id && body.data.id !== id) {
                console.error("[WEBHOOK] Payment ID mismatch - potential attack");
                return NextResponse.json(
                    { error: "Payment ID mismatch" },
                    { status: 400 }
                );
            }

            const paymentData = await payment.get({ id });

            // Validate payment exists and has required metadata
            if (!paymentData || !paymentData.metadata?.user_id) {
                console.error(`[WEBHOOK] Invalid payment data or missing metadata for payment ${id}`);
                return NextResponse.json(
                    { error: "Invalid payment" },
                    { status: 400 }
                );
            }

            if (paymentData.status === "approved") {
                const userId = paymentData.metadata.user_id;

                // Validate userId is a valid UUID format
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(userId)) {
                    console.error(`[WEBHOOK] Invalid user ID format: ${userId}`);
                    return NextResponse.json(
                        { error: "Invalid user ID" },
                        { status: 400 }
                    );
                }

                // Activate subscription
                const subscriptionEndDate = new Date();
                subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        subscriptionStatus: "active",
                        subscriptionPlan: "professional_monthly",
                        subscriptionEndsAt: subscriptionEndDate,
                        status: "ACTIVE",
                        subscriptionId: paymentData.id?.toString(),
                        canCreateServices: true,
                        listingVisible: true,
                        canReceiveBookings: true,
                        lastRenewalAt: new Date(),
                        nextBillingDate: subscriptionEndDate,
                        autoRenew: true,
                    },
                });

                console.log(`[WEBHOOK] Subscription activated for user ${userId} (Payment: ${paymentData.id})`);
            } else if (paymentData.status === "rejected" || paymentData.status === "cancelled") {
                // Handle failed/cancelled payments
                const userId = paymentData.metadata.user_id;
                console.log(`[WEBHOOK] Payment ${paymentData.status} for user ${userId}`);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("[WEBHOOK_ERROR]", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
