import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return new NextResponse("Missing token", { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return new NextResponse("Invalid token", { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                status: "ACTIVE",
                verificationToken: null
            }
        });

    } catch (error) {
        console.error("Verification error:", error);
        return new NextResponse("Error verifying account", { status: 500 });
    }

    // Redirect to onboarding if not completed, otherwise to dashboard
    redirect('/onboarding');
}
