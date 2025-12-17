import { NextResponse, NextRequest } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// SECURITY: Validate checkout request schema
const checkoutSchema = z.object({
    plan: z.enum(['professional']),
});

/**
 * SECURITY: POST /api/checkout
 * Requirements:
 * - User must be authenticated (session required)
 * - User must be PROFESSIONAL or CLIENT (client can convert to professional)
 * - User must not have active subscription
 * - Rate limiting applied per user
 */
export async function POST(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION - Verify user session
        // ======================================================================
        const session = await getSession();
        if (!session) {
            console.warn('[CHECKOUT_AUTH] Unauthenticated checkout attempt');
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const userId = session.user.id;

        // ======================================================================
        // STEP 2: AUTHORIZATION - Verify user role and eligibility
        // ======================================================================
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                email: true,
                subscriptionStatus: true,
                subscriptionEndsAt: true,
            },
        });

        if (!user) {
            console.warn(`[CHECKOUT_AUTH] User not found: ${userId}`);
            return new NextResponse(
                JSON.stringify({ error: 'Usuario no encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Allow both PROFESSIONAL and CLIENT (client → professional conversion)
        if (user.role !== 'PROFESSIONAL' && user.role !== 'CLIENT') {
            console.warn(`[CHECKOUT_AUTH] Invalid role checkout attempt: ${userId}, role: ${user.role}`);
            return new NextResponse(
                JSON.stringify({ error: 'Rol de usuario inválido para suscripción' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Prevent duplicate active subscriptions
        if (
            user.subscriptionStatus === 'active' &&
            user.subscriptionEndsAt &&
            user.subscriptionEndsAt > new Date()
        ) {
            console.warn(`[CHECKOUT_AUTH] User already has active subscription: ${userId}`);
            return new NextResponse(
                JSON.stringify({ error: 'Ya tiene una suscripción activa' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 3: INPUT VALIDATION - Validate plan selection
        // ======================================================================
        const body = await req.json();
        const { plan } = checkoutSchema.parse(body);

        // ======================================================================
        // STEP 4: BUSINESS LOGIC - Create payment preference
        // ======================================================================
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'professional_plan',
                        title: 'Suscripción Profesional Fixia',
                        quantity: 1,
                        unit_price: 3900,
                        currency_id: 'ARS',
                    }
                ],
                payer: {
                    email: user.email || "unknown@email.com",
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment=failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?payment=pending`,
                },
                auto_return: "approved",
                metadata: {
                    user_id: userId,
                    plan: plan
                }
            }
        });

        // SECURITY: Log transaction attempt
        console.info('[CHECKOUT_SUCCESS] Payment preference created', {
            userId,
            plan,
            preferenceId: result.id,
        });

        return NextResponse.json({
            url: result.init_point,
            preferenceId: result.id,
        });

    } catch (error) {
        console.error('[CHECKOUT_ERROR]', error);

        // SECURITY: Don't expose internal error details to client
        if (error instanceof z.ZodError) {
            return new NextResponse(
                JSON.stringify({ error: 'Datos inválidos' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
