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
        const { serviceId, providerId, price, title } = body;

        const userId = session.user.id;

        // ======================================================================
        // RULE: BLOCK IF UNREVIEWED MATCHES >= 2
        // ======================================================================
        // Find completed matches where current user (Client) hasn't left a review
        const matchesWithoutReview = await prisma.match.findMany({
            where: {
                clientId: userId,
                isCompleted: true,
                reviews: {
                    none: {
                        authorId: userId
                    }
                }
            }
        });

        if (matchesWithoutReview.length >= 2) {
            return NextResponse.json({
                error: "Tienes trabajos finalizados sin calificar. Debes calificar para continuar."
            }, { status: 403 });
        }

        // ======================================================================
        // LOGIC: CREATE REQUEST -> NOTIFY PROFESSIONAL
        // ======================================================================

        // 1. Create the Request
        // We set status to "PENDING_MATCH" or "OPEN" but effectively it's targeted
        const newRequest = await prisma.request.create({
            data: {
                clientId: userId,
                title: `Propuesta: ${title}`,
                description: `El cliente ${session.user.name} está interesado en tu servicio: ${title}.`,
                categoryId: "service_offer", // Or fetch from service
                location: "Ubicación del Cliente", // Should fetch from User Profile
                budget: parseFloat(price),
                status: "OPEN", // It's open until Accepted
            }
        });

        // 2. Create a "Proposal" to link it to the Professional?
        // Actually, to make it appear as a "Pending Match" for the Pro, 
        // we can create a Proposal from the PRO's side (system act)?
        // Or simpler: Create a Proposal from the CLIENT with status PENDING?
        // But Proposal usually means Pro offering to Client.
        // Let's create a Proposal where providerId = providerId.
        // And we add a flag or status.
        // Let's assume Proposal represents the connection.

        const proposal = await prisma.proposal.create({
            data: {
                requestId: newRequest.id,
                providerId: providerId,
                price: parseFloat(price),
                status: "PENDING_PRO_APPROVAL", // Custom status we'll handle
                message: "Propuesta de contratación directa desde tarjeta de servicio."
            }
        });

        // 3. Create Notification for Professional
        await prisma.notification.create({
            data: {
                userId: providerId,
                type: "MATCH_PROPOSAL",
                message: `¡Nueva propuesta de trabajo! ${session.user.name} quiere contratarte para: ${title}.`,
                actionUrl: `/dashboard/requests/${newRequest.id}` // Link to request detail
            }
        });

        return NextResponse.json({
            success: true,
            requestId: newRequest.id,
            message: "Propuesta enviada"
        });

    } catch (error) {
        console.error("Error in /api/matches/hire:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
