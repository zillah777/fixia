import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { requestId } = body;
        const providerId = session.user.id; // The one accepting

        // ======================================================================
        // RULE: BLOCK IF UNREVIEWED MATCHES >= 2
        // ======================================================================
        // Find completed matches where current user (Professional) hasn't left a review
        const matchesWithoutReview = await prisma.match.findMany({
            where: {
                providerId: providerId,
                isCompleted: true,
                reviews: {
                    none: {
                        authorId: providerId
                    }
                }
            }
        });

        if (matchesWithoutReview.length >= 2) {
            return NextResponse.json({
                error: "Tienes trabajos finalizados sin calificar. Debes calificar para aceptar nuevos trabajos."
            }, { status: 403 });
        }

        // ======================================================================
        // LOGIC: ACCEPT PROPOSAL -> CREATE MATCH -> REVEAL INFO
        // ======================================================================

        // Find the proposal pending approval for this request and provider
        const proposal = await prisma.proposal.findFirst({
            where: {
                requestId: requestId,
                providerId: providerId,
                status: "PENDING_PRO_APPROVAL"
            },
            include: {
                request: true
            }
        });

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found or already processed" }, { status: 404 });
        }

        // Transaction to ensure integrity
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Match
            const match = await tx.match.create({
                data: {
                    requestId: requestId,
                    providerId: providerId,
                    clientId: proposal.request.clientId,
                    whatsappRevealedAt: new Date(), // Reveal immediately upon match
                    isCompleted: false
                }
            });

            // 2. Update Proposal Status
            await tx.proposal.update({
                where: { id: proposal.id },
                data: { status: "ACCEPTED" }
            });

            // 3. Update Request Status
            await tx.request.update({
                where: { id: requestId },
                data: { status: "IN_PROGRESS" }
            });

            // 4. Notify Client
            await tx.notification.create({
                data: {
                    userId: proposal.request.clientId,
                    type: "MATCH_ACCEPTED",
                    message: `¡Match confirmado! ${session.user.name} ha aceptado tu propuesta.`,
                    actionUrl: `/dashboard/matches/${match.id}`
                }
            });

            return match;
        });

        return NextResponse.json({
            success: true,
            matchId: result.id,
            message: "Match creado exitosamente"
        });

    } catch (error) {
        console.error("Error in /api/matches/accept:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
