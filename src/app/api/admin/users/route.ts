import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
    const session = await getSession()
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        requests: true,
                        matchesAsProvider: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
