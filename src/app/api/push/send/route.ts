import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendNotification } from '@/lib/web-push';

export async function POST(request: Request) {
    try {
        const { userId, title, body, url } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
        }

        // Find all subscriptions for the user
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId },
        });

        if (subscriptions.length === 0) {
            return NextResponse.json({ error: 'No subscriptions found for this user' }, { status: 404 });
        }

        const payload = JSON.stringify({
            title: title || 'Notificación de Prueba',
            body: body || '¡Esto es una prueba de Fixia!',
            url: url || '/',
        });

        const results = await Promise.all(
            subscriptions.map(async (sub) => {
                const success = await sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth,
                        },
                    },
                    payload
                );
                return { id: sub.id, success };
            })
        );

        const successCount = results.filter((r) => r.success).length;

        return NextResponse.json({
            success: true,
            sent: successCount,
            total: subscriptions.length,
            results
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
