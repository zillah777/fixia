import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        const client = await prisma.user.findUnique({
            where: { id, role: "CLIENT" },
            include: {
                requests: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                reviewsGiven: {
                    include: {
                        professional: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        image: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                _count: {
                    select: {
                        requests: true,
                        reviewsGiven: true
                    }
                }
            }
        })

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }

        const formattedClient = {
            id: client.id,
            name: client.name,
            image: client.image || client.avatar || `https://ui-avatars.com/api/?name=${client.name}&background=random`,
            location: client.location || "Buenos Aires, Argentina",
            joinedDate: client.createdAt.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
            stats: {
                requestsMade: client._count.requests,
                reviewsGiven: client._count.reviewsGiven,
                activeRequests: client.requests.filter(r => r.status === 'OPEN').length
            },
            reviews: client.reviewsGiven.map(r => ({
                id: r.id,
                professionalName: r.professional?.user?.name || "Profesional",
                professionalImage: r.professional?.user?.image,
                rating: r.score,
                comment: r.comment,
                date: r.createdAt.toLocaleDateString('es-AR')
            }))
        }

        return NextResponse.json(formattedClient)
    } catch (error) {
        console.error("Error fetching client:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
