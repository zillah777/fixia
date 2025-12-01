import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const mode = searchParams.get("mode"); // 'mine' or 'marketplace'

        if (mode === 'marketplace') {
            // Fetch open requests for marketplace
            // Exclude own requests
            const requests = await prisma.request.findMany({
                where: {
                    status: "OPEN",
                    clientId: { not: session.user.id }
                },
                orderBy: { createdAt: "desc" },
                include: {
                    client: { select: { name: true } },
                    _count: { select: { proposals: true } }
                }
            });
            return NextResponse.json(requests);
        } else {
            // Default: Fetch my requests (as client)
            const requests = await prisma.request.findMany({
                where: { clientId: session.user.id },
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { proposals: true } } }
            });
            return NextResponse.json(requests);
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ error: "Error fetching requests" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Basic validation
        if (!data.title || !data.categoryId || !data.location) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                location: data.location,
                budget: data.budget ? parseFloat(data.budget) : null,
                status: "OPEN",
                clientId: session.user.id
            }
        });

        return NextResponse.json(newRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ error: "Error creating request" }, { status: 500 });
    }
}
