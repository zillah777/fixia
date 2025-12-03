import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/messages?matchId=...
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const matchId = searchParams.get("matchId");

        if (!matchId) {
            return new NextResponse("Match ID required", { status: 400 });
        }

        // Verify user belongs to match
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { providerId: true, clientId: true }
        });

        if (!match) {
            return new NextResponse("Match not found", { status: 404 });
        }

        if (match.providerId !== session.user.id && match.clientId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { matchId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                portfolioImages: true // Using this as a proxy for avatar if needed, or just name
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST /api/messages
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { matchId, text } = body;

        if (!matchId || !text) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Verify user belongs to match
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { providerId: true, clientId: true }
        });

        if (!match) {
            return new NextResponse("Match not found", { status: 404 });
        }

        if (match.providerId !== session.user.id && match.clientId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                matchId,
                senderId: session.user.id,
                text,
                isRead: false
            }
        });

        return NextResponse.json(message);

    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
