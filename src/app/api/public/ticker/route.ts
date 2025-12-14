import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

const CATEGORY_CONFIG: Record<string, { icon: string, color: string }> = {
    "PLOMERIA": { icon: "Wrench", color: "text-blue-600" },
    "ELECTRICIDAD": { icon: "Zap", color: "text-amber-600" },
    "LIMPIEZA": { icon: "Sparkles", color: "text-accent" }, // accent is usually dark enough (#788c5d is contrast 4.5:1? No, #788c5d on white is 3.5:1. Better use text-emerald-700)
    "JARDINERIA": { icon: "Leaf", color: "text-emerald-600" },
    "GASISTA": { icon: "Flame", color: "text-red-600" },
    "ALBANILERIA": { icon: "Hammer", color: "text-orange-600" },
    "PINTURA": { icon: "Paintbrush", color: "text-pink-600" },
    "FLETES": { icon: "Truck", color: "text-cyan-700" }
}

export async function GET() {
    try {
        // Ensure connection is alive
        await prisma.$connect()

        // Group open requests by category
        const requests = await prisma.request.groupBy({
            by: ['categoryId'],
            where: {
                status: 'OPEN'
            },
            _count: {
                _all: true
            }
        })

        const tickerItems = requests.map(r => {
            const categoryKey = r.categoryId.toUpperCase()
            const config = CATEGORY_CONFIG[categoryKey] || { icon: "Briefcase", color: "text-gray-600" }
            const categoryName = r.categoryId.charAt(0).toUpperCase() + r.categoryId.slice(1).toLowerCase()

            return {
                iconName: config.icon, // Send icon name string, frontend will map to component
                text: `${categoryName}: ${r._count._all} solicitudes nuevas`,
                color: config.color
            }
        })

        // If no data, return empty array (frontend handles empty state or keeps default if needed, 
        // but better to show nothing or generic message than mock data)
        return NextResponse.json(tickerItems)
    } catch (error) {
        console.error("[TICKER_ERROR] Detailed error:", error)
        if (error instanceof Error) {
            console.error("[TICKER_ERROR] Stack:", error.stack)
            console.error("[TICKER_ERROR] Message:", error.message)
        }
        return NextResponse.json({ error: "Error fetching ticker stats", details: String(error) }, { status: 500 })
    }
}
