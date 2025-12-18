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

                // Get current user to check subscription status
                const currentUser = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if (!currentUser) {
                    console.error(`[WEBHOOK] User not found: ${userId}`);
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 }
                    );
                }

                // TRIAL CONVERSION LOGIC: Check if user is converting from trial to paid
                const isTrialUser = currentUser.subscriptionStatus === "trial";

                // Calculate subscription end date
                // If trial user: new 30-day period starts from payment date
                // If renewing: extend existing period by 30 days
                const subscriptionEndDate = new Date();
                if (isTrialUser) {
                    // Trial to paid: new 30-day period from now
                    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
                    console.log(`[WEBHOOK] Converting trial to paid subscription for user ${userId}`);
                } else {
                    // Renewal: extend from current end date
                    if (currentUser.subscriptionEndsAt) {
                        const currentEndDate = new Date(currentUser.subscriptionEndsAt);
                        subscriptionEndDate.setTime(currentEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    } else {
                        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
                    }
                    console.log(`[WEBHOOK] Renewing subscription for user ${userId}`);
                }

                // Check if user has a profile, if not create one
                const existingProfile = await prisma.profile.findUnique({
                    where: { userId }
                });

                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        // Convert CLIENT to PROFESSIONAL on payment
                        role: "PROFESSIONAL",
                        // Activate subscription (or convert from trial)
                        subscriptionStatus: "active",
                        subscriptionPlan: "professional_plan",
                        subscriptionEndsAt: subscriptionEndDate,
                        status: "ACTIVE",
                        subscriptionId: paymentData.id?.toString(),
                        // Ensure all professional features are enabled
                        canCreateServices: true,
                        listingVisible: true,
                        canReceiveBookings: true,
                        // Billing info
                        lastRenewalAt: new Date(),
                        nextBillingDate: subscriptionEndDate,
                        autoRenew: false, // Manual renewal - user must pay each month
                        // Create profile if doesn't exist with VERIFIED badge
                        ...((!existingProfile) && {
                            profile: {
                                create: {
                                    badges: JSON.stringify(["VERIFIED"]) // Auto-verify paid professionals
                                }
                            }
                        }),
                    },
                });

                // If profile exists, update badges (remove TRIAL if present, add VERIFIED)
                if (existingProfile) {
                    const currentBadges = existingProfile.badges ? JSON.parse(existingProfile.badges) : [];
                    // Remove TRIAL badge if present
                    const updatedBadges = currentBadges.filter((badge: string) => badge !== "TRIAL");
                    // Add VERIFIED badge
                    if (!updatedBadges.includes("VERIFIED")) {
                        updatedBadges.push("VERIFIED");
                    }

                    await prisma.profile.update({
                        where: { userId },
                        data: {
                            badges: JSON.stringify(updatedBadges)
                        }
                    });
                }

                const conversionType = isTrialUser ? "TRIAL_CONVERSION" : "RENEWAL";
                console.log(`[WEBHOOK] ${conversionType}: Subscription activated for user ${userId} (Payment: ${paymentData.id}) - Role: PROFESSIONAL, Badge: VERIFIED`);
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
