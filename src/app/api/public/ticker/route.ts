import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const CATEGORY_CONFIG: Record<string, { icon: string, color: string }> = {
    "PLOMERIA": { icon: "Wrench", color: "text-blue-400" },
    "ELECTRICIDAD": { icon: "Zap", color: "text-yellow-400" },
    "LIMPIEZA": { icon: "Sparkles", color: "text-green-400" },
    "JARDINERIA": { icon: "Leaf", color: "text-green-600" },
    "GASISTA": { icon: "Flame", color: "text-red-400" },
    "ALBANILERIA": { icon: "Hammer", color: "text-orange-400" },
    "PINTURA": { icon: "Paintbrush", color: "text-pink-400" },
    "FLETES": { icon: "Truck", color: "text-cyan-400" }
}

export async function GET() {
    try {
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
            const config = CATEGORY_CONFIG[categoryKey] || { icon: "Briefcase", color: "text-gray-400" }
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
        console.error("Error fetching ticker stats:", error)
        return NextResponse.json({ error: "Error fetching ticker stats" }, { status: 500 })
    }
}
