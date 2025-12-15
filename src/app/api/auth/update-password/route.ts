import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { compare, hash } from "bcryptjs"

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isValid = await compare(currentPassword, user.password)
        if (!isValid) {
            return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 })
        }

        const hashedPassword = await hash(newPassword, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return NextResponse.json({ message: "Password updated" })
    } catch (error) {
        console.error("Error updating password:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
