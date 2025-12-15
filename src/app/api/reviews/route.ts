import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
    matchId: z.string().uuid("Invalid match ID"),
    targetId: z.string().uuid("Invalid target user ID"),
    score: z.number().int().min(1, "Score must be at least 1").max(5, "Score must be at most 5"),
    comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment must be less than 500 characters").optional(),
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        
        // Validate with Zod
        const validation = reviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0]?.message || "Invalid review data" },
                { status: 400 }
            );
        }

        const { matchId, targetId, score, comment } = validation.data;
        const authorId = session.user.id as string;

        // Prevent self-reviews
        if (authorId === targetId) {
            return NextResponse.json({ error: "Cannot review yourself" }, { status: 400 });
        }

        // SECURITY: Validate user participated in the match
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { clientId: true, providerId: true, isCompleted: true },
        });

        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        if (!match.isCompleted) {
            return NextResponse.json({ error: "Match must be completed before reviewing" }, { status: 400 });
        }

        // Verify user is part of the match (client or provider)
        if (match.clientId !== authorId && match.providerId !== authorId) {
            return NextResponse.json(
                { error: "You are not part of this match" },
                { status: 403 }
            );
        }

        // Verify target is the other party
        if (match.clientId === authorId && match.providerId !== targetId) {
            return NextResponse.json(
                { error: "Invalid target user for this match" },
                { status: 400 }
            );
        }

        if (match.providerId === authorId && match.clientId !== targetId) {
            return NextResponse.json(
                { error: "Invalid target user for this match" },
                { status: 400 }
            );
        }

        // Check if review already exists for this match and author
        const existingReview = await prisma.review.findUnique({
            where: {
                matchId_authorId: {
                    matchId,
                    authorId,
                },
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this match" },
                { status: 400 }
            );
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                matchId,
                authorId,
                targetId,
                score,
                comment: comment || null,
            },
        });

        // Update user's average rating
        const reviews = await prisma.review.findMany({
            where: { targetId },
            select: { score: true },
        });

        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
            await prisma.profile.update({
                where: { userId: targetId },
                data: { ratingAvg: avgRating },
            }).catch(err => console.error("Failed to update rating:", err));
        }

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("[REVIEWS_POST_ERROR]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const matchId = searchParams.get("matchId");
        const userId = searchParams.get("userId");

        if (!matchId && !userId) {
            return NextResponse.json({ error: "matchId or userId required" }, { status: 400 });
        }

        const where = matchId ? { matchId } : { targetId: userId };

        // Get reviews with author data (fetched separately to avoid Prisma relation issues)
        const reviews = await prisma.review.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        // Fetch author details for each review
        const reviewsWithAuthor = await Promise.all(
            reviews.map(async (review) => {
                const author = await prisma.user.findUnique({
                    where: { id: review.authorId },
                    select: { id: true, name: true, avatar: true },
                });
                return {
                    ...review,
                    author,
                };
            })
        );

        return NextResponse.json(reviewsWithAuthor);
    } catch (error) {
        console.error("[REVIEWS_GET_ERROR]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
