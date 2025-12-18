import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * GET /api/user/preferences
 * Obtener preferencias del usuario
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const preferences = await prisma.userPreference.findUnique({
            where: { userId: session.user.id }
        })

        // Si no existen, crear con defaults
        if (!preferences) {
            const newPreferences = await prisma.userPreference.create({
                data: {
                    userId: session.user.id,
                    dismissedTrialAlert: false
                }
            })
            return NextResponse.json(newPreferences)
        }

        return NextResponse.json(preferences)
    } catch (error) {
        console.error("Error fetching preferences:", error)
        return NextResponse.json(
            { error: "Error al obtener preferencias" },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/user/preferences
 * Actualizar preferencias del usuario
 */
export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await req.json()
        const { dismissedTrialAlert } = body

        const updated = await prisma.userPreference.upsert({
            where: { userId: session.user.id },
            update: {
                dismissedTrialAlert: dismissedTrialAlert ?? undefined
            },
            create: {
                userId: session.user.id,
                dismissedTrialAlert: dismissedTrialAlert ?? false
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Error updating preferences:", error)
        return NextResponse.json(
            { error: "Error al actualizar preferencias" },
            { status: 500 }
        )
    }
}
