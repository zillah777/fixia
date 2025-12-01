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

        // Fetch Recent Activity
        let recentActivity: any[] = [];

        if (role === "CLIENT") {
            const [requests, matches] = await Promise.all([
                prisma.request.findMany({
                    where: { clientId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, title: true, status: true, createdAt: true }
                }),
                prisma.match.findMany({
                    where: { clientId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    include: { provider: { select: { name: true } }, request: { select: { title: true } } }
                })
            ]);

            // Combine and sort
            recentActivity = [
                ...requests.map(r => ({
                    id: r.id,
                    type: 'REQUEST',
                    title: r.title,
                    description: `Estado: ${r.status}`,
                    date: r.createdAt,
                    status: r.status
                })),
                ...matches.map(m => ({
                    id: m.id,
                    type: 'MATCH',
                    title: `Match con ${m.provider.name}`,
                    description: `Para: ${m.request.title}`,
                    date: m.createdAt,
                    status: m.isCompleted ? 'COMPLETED' : 'ACTIVE'
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        } else if (role === "PROFESSIONAL") {
            const matches = await prisma.match.findMany({
                where: { providerId: userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { client: { select: { name: true } }, request: { select: { title: true } } }
            });

            recentActivity = matches.map(m => ({
                id: m.id,
                type: 'JOB',
                title: `Trabajo para ${m.client.name}`,
                description: m.request.title,
                date: m.createdAt,
                status: m.isCompleted ? 'COMPLETED' : 'ACTIVE'
            }));
        } else if (role === "ADMIN") {
            const [newUsers, newRequests] = await Promise.all([
                prisma.user.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, name: true, role: true, createdAt: true }
                }),
                prisma.request.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, title: true, status: true, createdAt: true }
                })
            ]);

            recentActivity = [
                ...newUsers.map(u => ({
                    id: u.id,
                    type: 'USER',
                    title: `Nuevo Usuario: ${u.name}`,
                    description: `Rol: ${u.role}`,
                    date: u.createdAt,
                    status: 'NEW'
                })),
                ...newRequests.map(r => ({
                    id: r.id,
                    type: 'REQUEST',
                    title: `Nueva Solicitud: ${r.title}`,
                    description: `Estado: ${r.status}`,
                    date: r.createdAt,
                    status: r.status
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        }

        // Calculate Trending Category (Global)
        const trendingGroup = await prisma.request.groupBy({
            by: ['categoryId'],
            _count: {
                categoryId: true
            },
            orderBy: {
                _count: {
                    categoryId: 'desc'
                }
            },
            take: 1
        });

        const trendingCategory = trendingGroup.length > 0 ? trendingGroup[0].categoryId : "General";
        // In a real app, you'd fetch the category name if it's an ID. Assuming string for now or mapped.

        return NextResponse.json({ ...stats, recentActivity, trendingCategory });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
