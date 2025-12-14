import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

const CATEGORY_CONFIG: Record<string, { icon: string, color: string }> = {
    "PLOMERIA": { icon: "💧", color: "from-blue-500/20 to-cyan-500/20" },
    "ELECTRICIDAD": { icon: "⚡", color: "from-yellow-500/20 to-orange-500/20" },
    "LIMPIEZA": { icon: "✨", color: "from-green-500/20 to-emerald-500/20" },
    "JARDINERIA": { icon: "🌿", color: "from-green-600/20 to-lime-500/20" },
    "GASISTA": { icon: "🔥", color: "from-red-500/20 to-orange-600/20" },
    "ALBANILERIA": { icon: "🧱", color: "from-gray-500/20 to-stone-500/20" }
}

export async function GET() {
    try {
        // Group users by category (assuming category is stored in Profile or Service)
        // Since we don't have a direct category on User, we might need to check Services
        // For now, let's assume we fetch from Services or use a mock distribution if data is scarce

        // Real implementation: Group by Service category
        const services = await prisma.service.groupBy({
            by: ['categoryId'],
            _count: {
                _all: true
            }
        })

        const categories = services.map(s => {
            const config = CATEGORY_CONFIG[s.categoryId] || { icon: "🔧", color: "from-gray-500/20 to-gray-500/20" }
            return {
                id: s.categoryId.toLowerCase(),
                name: s.categoryId.charAt(0) + s.categoryId.slice(1).toLowerCase(),
                icon: config.icon,
                count: `${s._count._all}+`,
                color: config.color
            }
        })

        // Fallback if no services exist yet (to avoid empty homepage)
        if (categories.length === 0) {
            return NextResponse.json([
                { id: "plomeria", name: "Plomería", icon: "💧", count: "0", color: "from-blue-500/20 to-cyan-500/20" },
                { id: "electricidad", name: "Electricidad", icon: "⚡", count: "0", color: "from-yellow-500/20 to-orange-500/20" }
            ])
        }

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching categories" }, { status: 500 })
    }
}
