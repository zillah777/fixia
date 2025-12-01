import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const role = session.user.role;

        let stats = {
            completedRequests: 0,
            activeRequests: 0,
            leads: 0,
            rating: 0,
        };

        if (role === "CLIENT") {
            const [completed, active] = await Promise.all([
                prisma.request.count({
                    where: {
                        clientId: userId,
                        status: "COMPLETED",
                    },
                }),
                prisma.request.count({
                    where: {
                        clientId: userId,
                        status: { in: ["OPEN", "MATCHED"] },
                    },
                }),
            ]);
            stats.completedRequests = completed;
            stats.activeRequests = active;
        } else if (role === "PROFESSIONAL") {
            const [completedMatches, activeMatches, profile] = await Promise.all([
                prisma.match.count({
                    where: {
                        providerId: userId,
                        isCompleted: true,
                    },
                }),
                prisma.match.count({
                    where: {
                        providerId: userId,
                        isCompleted: false,
                    },
                }),
                prisma.profile.findUnique({
                    where: { userId },
                    select: { ratingAvg: true },
                }),
            ]);

            stats.completedRequests = completedMatches;
            stats.leads = activeMatches; // Using active matches as "leads" or "active jobs"
            stats.rating = profile?.ratingAvg || 0;
        } else if (role === "ADMIN") {
            // Admin stats could be global
            const [totalUsers, totalRequests] = await Promise.all([
                prisma.user.count(),
                prisma.request.count()
            ]);
            stats.activeRequests = totalRequests;
            stats.leads = totalUsers; // Reusing field for total users
        }

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
