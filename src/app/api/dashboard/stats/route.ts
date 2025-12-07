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
        console.log("Dashboard Stats Request:", { userId, role });

        let stats = {
            completedRequests: 0,
            activeRequests: 0,
            leads: 0,
            rating: 0,
        };
        let recentActivity: any[] = [];

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
            const [completedMatches, activeMatches, profile, servicesCount, activeProposals] = await Promise.all([
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
                prisma.service.count({
                    where: { providerId: userId }
                }),
                prisma.proposal.count({
                    where: { providerId: userId, status: "PENDING" }
                })
            ]);

            stats.completedRequests = completedMatches;
            stats.leads = activeMatches; // Active Matches (Jobs in progress)
            stats.rating = profile?.ratingAvg || 0;
            // Add custom stats for professional
            (stats as any).servicesCount = servicesCount;
            (stats as any).activeProposals = activeProposals;

            // Activity: Matches + Services + Proposals + Requests (Client side)
            const [matches, services, proposals, requests] = await Promise.all([
                prisma.match.findMany({
                    where: { providerId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    include: { client: { select: { name: true } }, request: { select: { title: true } } }
                }),
                prisma.service.findMany({
                    where: { providerId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, title: true, createdAt: true }
                }),
                prisma.proposal.findMany({
                    where: { providerId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    include: { request: { select: { title: true } } }
                }),
                prisma.request.findMany({
                    where: { clientId: userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    select: { id: true, title: true, status: true, createdAt: true }
                })
            ]);

            console.log("Activity Counts:", { matches: matches.length, services: services.length, proposals: proposals.length, requests: requests.length });

            recentActivity = [
                ...matches.map(m => ({
                    id: m.id,
                    type: 'JOB',
                    title: `Trabajo para ${m.client.name}`,
                    description: m.request.title,
                    date: m.createdAt,
                    status: m.isCompleted ? 'COMPLETADO' : 'EN CURSO'
                })),
                ...services.map(s => ({
                    id: s.id,
                    type: 'SERVICE',
                    title: `Nuevo Servicio Publicado`,
                    description: s.title,
                    date: s.createdAt,
                    status: 'PUBLICADO'
                })),
                ...proposals.map(p => ({
                    id: p.id,
                    type: 'PROPOSAL',
                    title: `Propuesta Enviada`,
                    description: `Para: ${p.request.title}`,
                    date: p.createdAt,
                    status: p.status
                })),
                ...requests.map(r => ({
                    id: r.id,
                    type: 'REQUEST',
                    title: `Solicitud Creada`,
                    description: r.title,
                    date: r.createdAt,
                    status: r.status
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
            // Chart Data: Last 7 Days Activity (All types)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const [last7Matches, last7Services, last7Proposals, last7Requests] = await Promise.all([
                prisma.match.findMany({
                    where: { providerId: userId, createdAt: { gte: sevenDaysAgo } },
                    select: { createdAt: true }
                }),
                prisma.service.findMany({
                    where: { providerId: userId, createdAt: { gte: sevenDaysAgo } },
                    select: { createdAt: true }
                }),
                prisma.proposal.findMany({
                    where: { providerId: userId, createdAt: { gte: sevenDaysAgo } },
                    select: { createdAt: true }
                }),
                prisma.request.findMany({
                    where: { clientId: userId, createdAt: { gte: sevenDaysAgo } },
                    select: { createdAt: true }
                })
            ]);

            const allActivity = [
                ...last7Matches,
                ...last7Services,
                ...last7Proposals,
                ...last7Requests
            ];

            const chartData = {};
            // Initialize last 7 days
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                (chartData as any)[dateStr] = 0;
            }

            // Fill counts
            allActivity.forEach(item => {
                const dateStr = item.createdAt.toISOString().split('T')[0];
                if ((chartData as any)[dateStr] !== undefined) {
                    (chartData as any)[dateStr]++;
                }
            });

            // Convert to array format for Recharts
            const weeklyStats = Object.keys(chartData).sort().map(date => {
                const d = new Date(date);
                // Adjust for timezone if needed, but simple UTC date string match is often "good enough" for daily buckets if consistent.
                // Recharts expects array.
                return {
                    name: d.toLocaleDateString('es-AR', { weekday: 'short' }),
                    date: date, // Keep full date for sorting/debugging
                    activity: (chartData as any)[date]
                };
            });

            // Add weeklyStats to response object
            (stats as any).weeklyStats = weeklyStats;

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
