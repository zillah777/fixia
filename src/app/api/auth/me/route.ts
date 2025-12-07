import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // Fetch fresh user data from DB to get latest subscription status
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                subscriptionStatus: true,
                subscriptionEndsAt: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("[AUTH_ME_ERROR]", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
