import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const mode = searchParams.get("mode");

        if (mode === 'marketplace') {
            // Exclude own requests and soft-deleted requests
            const requests = await prisma.request.findMany({
                where: {
                    status: "OPEN",
                    clientId: { not: session.user.id },
                    isDeleted: false
                },
                orderBy: { createdAt: "desc" },
                include: {
                    client: { select: { name: true } },
                    _count: { select: { proposals: true } }
                }
            });
            const formattedRequests = requests.map(req => ({
                ...req,
                images: JSON.parse(req.images || "[]"),
                tags: JSON.parse(req.tags || "[]")
            }));
            return NextResponse.json(formattedRequests);
        } else {
            // Default: Fetch my requests (as client) - exclude soft-deleted
            const requests = await prisma.request.findMany({
                where: {
                    clientId: session.user.id,
                    isDeleted: false
                },
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { proposals: true } } }
            });
            const formattedRequests = requests.map(req => ({
                ...req,
                images: JSON.parse(req.images || "[]"),
                tags: JSON.parse(req.tags || "[]")
            }));
            return NextResponse.json(formattedRequests);
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ error: "Error al obtener solicitudes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const data = await request.json();

        // Basic validation
        if (!data.title || !data.categoryId || !data.location) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                title: data.title,
                description: data.description,
                categoryId: data.categoryId,
                location: data.location,
                budget: data.budget ? parseFloat(data.budget) : null,
                status: "OPEN",
                clientId: session.user.id,
                images: data.images ? JSON.stringify(data.images) : "[]",
                tags: data.tags ? JSON.stringify(data.tags) : "[]"
            }
        });

        // ====================================================================
        // LEAD GENERATION: Notify matching professionals
        // ====================================================================
        try {
            // Find pros who have a Service in this category
            const matchingPros = await prisma.service.findMany({
                where: { categoryId: data.categoryId },
                select: { providerId: true },
                distinct: ['providerId']
            });

            if (matchingPros.length > 0) {
                const notifications = matchingPros.map(pro =>
                    notifyUser({
                        userId: pro.providerId,
                        type: "NEW_OPPORTUNITY",
                        title: "¡Nueva Oportunidad!",
                        message: `Hay una nueva solicitud en tu categoría: ${data.title}.`,
                        actionUrl: `/dashboard/opportunities`
                    })
                );
                // Execute in background so we don't block the response
                Promise.allSettled(notifications).catch(err =>
                    console.error("Error sending lead notifications:", err)
                );
            }
        } catch (matchError) {
            console.error("Error in lead generation matching:", matchError);
            // Don't fail the request creation itself
        }

        return NextResponse.json({
            ...newRequest,
            images: JSON.parse(newRequest.images),
            tags: JSON.parse(newRequest.tags)
        });
    } catch (error) {
        console.error("Error creating request:", error);
        return NextResponse.json({ error: "Error al crear la solicitud" }, { status: 500 });
    }
}
