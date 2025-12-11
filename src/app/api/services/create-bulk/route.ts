import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface ServiceInput {
    name: string
    description: string
    priceFrom: string
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Only professionals can create services
        if (session.user.role !== "PROFESSIONAL") {
            return NextResponse.json(
                { error: "Only professionals can create services" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { services } = body as { services: ServiceInput[] }

        if (!Array.isArray(services) || services.length === 0) {
            return NextResponse.json(
                { error: "At least one service is required" },
                { status: 400 }
            )
        }

        // Validate and create services
        const createdServices = await Promise.all(
            services
                .filter((s) => s.name.trim() !== "")
                .map((service) =>
                    prisma.service.create({
                        data: {
                            name: service.name,
                            description: service.description || "",
                            price: service.priceFrom ? parseFloat(service.priceFrom) : 0,
                            providerId: session.user.id,
                        },
                    })
                )
        )

        return NextResponse.json({
            success: true,
            services: createdServices,
        })
    } catch (error) {
        console.error("Error creating services:", error)
        return NextResponse.json(
            { error: "Error creating services" },
            { status: 500 }
        )
    }
}
