import prismaDefault from "@/lib/prisma"
import { User } from "@prisma/client"

const prisma = prismaDefault

export async function getUserById(id: string): Promise<User | null> {
    try {
        return await prisma.user.findUnique({
            where: { id },
        })
    } catch (error) {
        console.error("Error getting user:", error)
        return null
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
    })
}

export async function getUserWithProfile(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            profile: true,
            services: true,
        },
    })
}
