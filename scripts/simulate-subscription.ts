
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = '83f49469-8ba1-4599-ba9e-13eb1480ec2f';
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    console.log(`Updating subscription for user: ${userId}`);

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionStatus: 'active',
                subscriptionPlan: 'professional_monthly',
                subscriptionId: 'simulated_sub_' + Math.random().toString(36).substring(7),
                subscriptionEndsAt: thirtyDaysFromNow,
                lastRenewalAt: now,
                nextBillingDate: thirtyDaysFromNow,
                autoRenew: true,
                // Enable professional features
                canCreateServices: true,
                listingVisible: true,
                canReceiveBookings: true,
            },
        });

        console.log('User subscription updated successfully:', user);
    } catch (error) {
        console.error('Error updating user subscription:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
