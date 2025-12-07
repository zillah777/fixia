"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function toggleUserStatus(userId: string, currentStatus: string) {
    const session = await getSession()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"

    await prisma.user.update({
        where: { id: userId },
        data: { status: newStatus }
    })

    revalidatePath("/admin/users")
    return { success: true, newStatus }
}

export async function deleteUser(userId: string) {
    const session = await getSession()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}
