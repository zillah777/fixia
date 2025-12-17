import prisma from "@/lib/prisma"

export class BadgeService {
    /**
     * Recalculates all badges for a specific professional
     */
    static async recalculateBadges(userId: string) {
        try {
            const [profile, stats] = await Promise.all([
                prisma.profile.findUnique({ where: { userId } }),
                this.getUserStats(userId)
            ])

            if (!profile) return

            let currentBadges: string[] = []
            try {
                currentBadges = profile.badges ? JSON.parse(profile.badges) : []
            } catch (e) {
                currentBadges = []
            }

            // preserving manual badges or verification if handled elsewhere, 
            // but here we can re-verify conditions.
            // Let's keep VERIFIED if it exists (handled by admin)
            const isVerified = currentBadges.includes("VERIFIED")

            const newBadges = new Set<string>()
            if (isVerified) newBadges.add("VERIFIED")

            // 1. EXPERT BADGE
            // Criteria: > 10 completed matches AND > 4.5 average rating
            if (stats.completedMatches >= 10 && stats.avgRating >= 4.5) {
                newBadges.add("EXPERT")
            }

            // 2. TRENDING BADGE
            // Criteria: > 5 proposals sent in the last 7 days
            if (stats.recentProposals >= 5) {
                newBadges.add("TRENDING")
            }

            // 3. FAST RESPONDER (RAYO)
            // Criteria: Avg response time < 120 minutes (2 hours)
            // We'll approximate this by checking if they have at least 5 proposals 
            // and the latest ones were created shortly after the request.
            // For MVP, let's use a simpler heuristic: > 80% of proposals sent within 24h of request creation
            if (stats.totalProposals >= 5 && stats.fastResponseRate >= 0.8) {
                newBadges.add("FAST")
            }

            // Update DB
            await prisma.profile.update({
                where: { userId },
                data: {
                    badges: JSON.stringify(Array.from(newBadges))
                }
            })

            console.log(`Updated badges for ${userId}:`, Array.from(newBadges))

        } catch (error) {
            console.error("Error recalculating badges:", error)
        }
    }

    private static async getUserStats(userId: string) {
        // 1. Completed Matches & Rating
        const completedMatches = await prisma.match.count({
            where: {
                providerId: userId,
                isCompleted: true
            }
        })

        const reviews = await prisma.review.findMany({
            where: { targetId: userId },
            select: { score: true }
        })

        const totalScore = reviews.reduce((acc, r) => acc + r.score, 0)
        const avgRating = reviews.length > 0 ? totalScore / reviews.length : 0

        // 2. Recent Proposals (Last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentProposals = await prisma.proposal.count({
            where: {
                providerId: userId,
                createdAt: { gte: sevenDaysAgo }
            }
        })

        // 3. Fast Response Rate
        // Get last 20 proposals to check speed
        const lastProposals = await prisma.proposal.findMany({
            where: { providerId: userId },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: { request: true }
        })

        let fastCount = 0
        if (lastProposals.length > 0) {
            lastProposals.forEach(p => {
                const diffTime = Math.abs(p.createdAt.getTime() - p.request.createdAt.getTime())
                const diffHours = diffTime / (1000 * 60 * 60)
                if (diffHours <= 24) fastCount++
            })
        }

        const fastResponseRate = lastProposals.length > 0 ? fastCount / lastProposals.length : 0

        return {
            completedMatches,
            avgRating,
            recentProposals,
            totalProposals: lastProposals.length, // approximation
            fastResponseRate
        }
    }
}
