import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || "ALL"
    const status = searchParams.get("status") || "ALL"

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } }
      ]
    }

    if (role !== "ALL") {
      where.role = role
    }

    if (status !== "ALL") {
      where.status = status
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        subscriptionStatus: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("[ADMIN_USERS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
