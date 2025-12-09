import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { matchId, targetId, score, comment } = body

        if (!matchId || !targetId || !score) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const authorId = session.user.id as string

        // SECURITY: Validate user participated in the match
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { clientId: true, providerId: true, isCompleted: true }
        })

        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 })
        }

        // Verify user is part of the match (client or provider)
        if (match.clientId !== authorId && match.providerId !== authorId) {
            return NextResponse.json(
                { error: "You are not part of this match" },
                { status: 403 }
            )
        }

        // Verify match is completed
        if (!match.isCompleted) {
            return NextResponse.json(
                { error: "Cannot review an uncompleted match" },
                { status: 400 }
            )
        }

        // SECURITY: Check for existing review by same author for same match
        const existingReview = await prisma.review.findFirst({
            where: {
                matchId,
                authorId,
                targetId
            }
        })

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this match" },
                { status: 400 }
            )
        }

        // Create Review
        const review = await prisma.review.create({
            data: {
                matchId,
                authorId,
                targetId,
                score,
                comment
            }
        })

        // Update Trust Score (Simple Algorithm: Average * 20)
        // 1. Get all reviews for target
        const reviews = await prisma.review.findMany({
            where: { targetId }
        })

        const totalScore = reviews.reduce((acc, r) => acc + r.score, 0)
        const avgRating = totalScore / reviews.length
        const newTrustScore = Math.round(avgRating * 20) // 5 stars = 100 points

        // Update Profile
        await prisma.profile.update({
            where: { userId: targetId },
            data: {
                ratingAvg: avgRating,
                trustScore: newTrustScore
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error("Error creating review:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
