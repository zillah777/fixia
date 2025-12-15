import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const proposalSchema = z.object({
    requestId: z.string().uuid("Invalid request ID"),
    price: z.number().positive("Price must be greater than 0").max(999999, "Price is too high"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "PROFESSIONAL") {
            return NextResponse.json({ error: "Only professionals can submit proposals" }, { status: 403 });
        }

        const body = await request.json();
        
        // Validate with Zod
        const validation = proposalSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0]?.message || "Invalid proposal data" },
                { status: 400 }
            );
        }

        const { requestId, price, message } = validation.data;
        const providerId = session.user.id as string;

        // Verify request exists and is still open
        const serviceRequest = await prisma.request.findUnique({
            where: { id: requestId },
            select: { id: true, clientId: true, status: true },
        });

        if (!serviceRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (serviceRequest.status !== "OPEN") {
            return NextResponse.json({ error: "Request is no longer open" }, { status: 400 });
        }

        // Prevent self-proposals
        if (serviceRequest.clientId === providerId) {
            return NextResponse.json({ error: "Cannot propose your own request" }, { status: 400 });
        }

        // Check if proposal already exists for this professional
        const existingProposal = await prisma.proposal.findFirst({
            where: {
                requestId,
                providerId,
            },
        });

        if (existingProposal) {
            return NextResponse.json({ error: "You already have a proposal for this request" }, { status: 400 });
        }

        // Create proposal
        const proposal = await prisma.proposal.create({
            data: {
                requestId,
                providerId,
                price,
                message,
            },
            include: {
                provider: {
                    select: { name: true, profile: { select: { ratingAvg: true, badges: true } } },
                },
            },
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error) {
        console.error("[PROPOSALS_POST_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get("requestId");
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
        const skip = (page - 1) * limit;

        let where: any = {};

        if (requestId) {
            where.requestId = requestId;
        } else if (session.user.role === "PROFESSIONAL") {
            where.providerId = session.user.id;
        } else {
            where.request = { clientId: session.user.id };
        }

        const [proposals, total] = await Promise.all([
            prisma.proposal.findMany({
                where,
                skip,
                take: limit,
                include: {
                    provider: {
                        select: { id: true, name: true, avatar: true, profile: { select: { ratingAvg: true } } },
                    },
                    request: {
                        select: { title: true, status: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.proposal.count({ where }),
        ]);

        return NextResponse.json({
            data: proposals,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("[PROPOSALS_GET_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
