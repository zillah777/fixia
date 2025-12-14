import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const subscription = await request.json();
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if subscription already exists to avoid duplicates
        const existing = await prisma.pushSubscription.findUnique({
            where: { endpoint: subscription.endpoint }
        });

        if (existing) {
            // Update user if changed? Or just return success.
            // If the same browser is used by different user, we might want to update userId.
            if (existing.userId !== session.user.id) {
                await prisma.pushSubscription.update({
                    where: { id: existing.id },
                    data: { userId: session.user.id }
                });
            }
            return NextResponse.json({ success: true });
        }

        await prisma.pushSubscription.create({
            data: {
                userId: session.user.id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving subscription:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
