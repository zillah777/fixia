import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { portfolioImages: true }
        });

        if (!profile) {
            return NextResponse.json([]);
        }

        // Parse portfolioImages JSON
        const portfolio = JSON.parse(profile.portfolioImages || "[]");
        return NextResponse.json(portfolio);

    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "PROFESSIONAL") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, images } = await req.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        // Get current portfolio
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { portfolioImages: true }
        });

        const currentPortfolio = JSON.parse(profile?.portfolioImages || "[]");

        // Add new item
        const newItem = {
            id: `portfolio_${Date.now()}`,
            title,
            description,
            images: images || [],
            createdAt: new Date().toISOString()
        };

        currentPortfolio.push(newItem);

        // Update profile
        await prisma.profile.upsert({
            where: { userId: session.user.id },
            update: {
                portfolioImages: JSON.stringify(currentPortfolio)
            },
            create: {
                userId: session.user.id,
                portfolioImages: JSON.stringify(currentPortfolio)
            }
        });

        return NextResponse.json(newItem);

    } catch (error) {
        console.error("Error creating portfolio item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
