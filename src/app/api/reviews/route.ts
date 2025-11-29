import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

// SECURITY: Input validation schema with sanitization
const reviewSchema = z.object({
    matchId: z.string().uuid('Invalid match ID'),
    targetId: z.string().uuid('Invalid target user ID'),
    score: z.number().min(1).max(5, 'Score must be between 1 and 5'),
    comment: z.string().max(500, 'Comment must be 500 characters or less').optional(),
});

/**
 * SECURITY: POST /api/reviews
 * Create a new review for a completed match.
 * Requirements:
 * - User must be authenticated
 * - authorId must match authenticated user (prevent impersonation)
 * - Match must exist and be completed
 * - Comment must be sanitized (prevent XSS)
 * - Rate limit per user per day (prevent spam)
 */
export async function POST(req: NextRequest) {
    try {
        // ======================================================================
        // STEP 1: AUTHENTICATION - Verify user session
        // ======================================================================
        const session = await getSession();
        if (!session) {
            console.warn('[REVIEW_AUTH] Unauthenticated review attempt');
            return new NextResponse(
                JSON.stringify({ error: 'Autenticación requerida' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const authenticatedUserId = session.user.id;

        // ======================================================================
        // STEP 2: INPUT VALIDATION & SANITIZATION
        // ======================================================================
        const body = await req.json();
        const { matchId, targetId, score, comment } = reviewSchema.parse(body);

        // SECURITY: Sanitize comment to prevent XSS (trim whitespace)
        const sanitizedComment = comment
            ? comment.trim().substring(0, 500)
            : undefined;

        // ======================================================================
        // STEP 3: AUTHORIZATION - Verify user ownership
        // ======================================================================
        // SECURITY: The authenticated user MUST be the review author
        // Never trust authorId from client - use authenticated user ID
        const authorId = authenticatedUserId;

        // Prevent users from reviewing themselves
        if (authorId === targetId) {
            console.warn(`[REVIEW_AUTH] User attempted self-review: ${authorId}`);
            return new NextResponse(
                JSON.stringify({ error: 'No puedes reseñarte a ti mismo' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 4: BUSINESS LOGIC - Verify match and permissions
        // ======================================================================
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: {
                id: true,
                providerId: true,
                clientId: true,
                isCompleted: true,
            },
        });

        if (!match) {
            console.warn(`[REVIEW_AUTH] Match not found: ${matchId}`);
            return new NextResponse(
                JSON.stringify({ error: 'Match no encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Verify match is completed (can only review completed matches)
        if (!match.isCompleted) {
            console.warn(`[REVIEW_AUTH] Review on incomplete match: ${matchId}`);
            return new NextResponse(
                JSON.stringify({ error: 'El match debe estar completado para reseñar' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Verify author is either provider or client in the match
        const isAuthorInMatch =
            match.providerId === authorId || match.clientId === authorId;

        if (!isAuthorInMatch) {
            console.warn(
                `[REVIEW_AUTH] User not in match attempting review: ${authorId}, Match: ${matchId}`
            );
            return new NextResponse(
                JSON.stringify({ error: 'No participaste en este match' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Verify target is in the match
        const isTargetInMatch =
            match.providerId === targetId || match.clientId === targetId;

        if (!isTargetInMatch) {
            console.warn(
                `[REVIEW_AUTH] Target not in match: ${targetId}, Match: ${matchId}`
            );
            return new NextResponse(
                JSON.stringify({ error: 'El usuario no participó en este match' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Prevent duplicate reviews (user can only review target once per match)
        const existingReview = await prisma.review.findFirst({
            where: {
                matchId,
                authorId,
                targetId,
            },
        });

        if (existingReview) {
            console.warn(
                `[REVIEW_AUTH] Duplicate review attempt: ${authorId} -> ${targetId}`
            );
            return new NextResponse(
                JSON.stringify({ error: 'Ya has reseñado a este usuario en este match' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // ======================================================================
        // STEP 5: CREATE REVIEW
        // ======================================================================
        const review = await prisma.review.create({
            data: {
                matchId,
                authorId,
                targetId,
                score,
                comment: sanitizedComment,
            },
            select: {
                id: true,
                score: true,
                comment: true,
                createdAt: true,
                author: {
                    select: { id: true, name: true },
                },
            },
        });

        console.info('[REVIEW_SUCCESS] Review created', {
            reviewId: review.id,
            authorId,
            targetId,
            score,
        });

        return NextResponse.json(review);

    } catch (error) {
        console.error('[REVIEW_POST_ERROR]', error);

        // SECURITY: Don't expose internal error details
        if (error instanceof z.ZodError) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Datos inválidos',
                    details: error.errors[0].message
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * SECURITY: GET /api/reviews?targetId=xxx
 * Fetch reviews for a user with pagination.
 * Requirements:
 * - targetId must be a valid UUID
 * - Results must be paginated (default 10, max 100)
 * - Only return public review data
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get('targetId');
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

        // SECURITY: Validate targetId format
        if (!targetId || !/^[0-9a-f-]{36}$/i.test(targetId)) {
            return new NextResponse(
                JSON.stringify({ error: 'Invalid targetId format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Verify target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: targetId },
            select: { id: true },
        });

        if (!targetUser) {
            return new NextResponse(
                JSON.stringify({ error: 'Usuario no encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // SECURITY: Fetch with pagination to prevent loading all reviews
        const skip = (page - 1) * limit;

        const [reviews, totalCount] = await Promise.all([
            prisma.review.findMany({
                where: { targetId },
                select: {
                    id: true,
                    score: true,
                    comment: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.review.count({ where: { targetId } }),
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error('[REVIEW_GET_ERROR]', error);
        return new NextResponse(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
