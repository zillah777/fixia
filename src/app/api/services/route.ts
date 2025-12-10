import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { canUserCreateServices } from "@/lib/permissions"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const services = await prisma.service.findMany({
            where: { providerId: session.user.id as string },
            orderBy: { createdAt: "desc" }
        })

        const formattedServices = services.map(service => ({
            ...service,
            images: JSON.parse(service.images || "[]"),
            tags: JSON.parse(service.tags || "[]")
        }))

        return NextResponse.json(formattedServices)
    } catch (error) {
        console.error("Error fetching services:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // SECURITY: Validate user can create services
        const canCreate = await canUserCreateServices()
        if (!canCreate) {
            return NextResponse.json({
                error: "Se requiere una suscripción activa e identidad verificada para crear servicios",
                code: "SUBSCRIPTION_REQUIRED"
            }, { status: 403 })
        }

        const body = await request.json()
        const { title, categoryId, price, description, tags, images } = body

        if (!title || !categoryId || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const newService = await prisma.service.create({
            data: {
                providerId: session.user.id as string,
                title,
                categoryId,
                price: parseFloat(price),
                description: description || "",
                tags: tags ? JSON.stringify(tags) : "[]",
                images: images ? JSON.stringify(images) : "[]"
            }
        })

        return NextResponse.json({
            ...newService,
            images: JSON.parse(newService.images),
            tags: JSON.parse(newService.tags)
        })
    } catch (error) {
        console.error("Error creating service:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
