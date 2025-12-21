import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET: Fetch professionals for growth management
export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        const professionals = await prisma.user.findMany({
            where: {
                role: "PROFESSIONAL",
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                subscriptionStatus: true,
                subscriptionEndsAt: true,
                createdAt: true,
                profile: {
                    select: {
                        badges: true,
                        ratingAvg: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        return NextResponse.json(professionals);
    } catch (error) {
        console.error("[GROWTH_API_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST: Manage professional growth (Extend trials / Reset status)
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { userId, action, days } = body;

        if (!userId || !action) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (action === "EXTEND_TRIAL") {
            const extensionDays = days || 30;
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

            // Calculate new end date
            const currentEnd = user.subscriptionEndsAt && user.subscriptionEndsAt > new Date()
                ? new Date(user.subscriptionEndsAt)
                : new Date();

            const newEnd = new Date(currentEnd.getTime() + extensionDays * 24 * 60 * 60 * 1000);

            await prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionStatus: "trial", // Set or keep as trial but extended
                    subscriptionEndsAt: newEnd,
                    status: "ACTIVE",
                    listingVisible: true,
                }
            });

            return NextResponse.json({ message: `Suscripción extendida por ${extensionDays} días` });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("[GROWTH_API_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
