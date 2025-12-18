import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log("Testing Auth & Profile Flow...")
    try {
        // 1. Create a User manually (simulating Register API)
        const email = `test-${Date.now()}@example.com`
        const password = await bcrypt.hash("password123", 10)

        console.log(`Creating user: ${email}`)
        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email,
                password,
                role: "CLIENT",
                status: "ACTIVE",
                verificationToken: randomUUID()
            },
            include: { profile: true }
        })
        console.log("User created:", user.id)

        // 2. Query the profile (simulating Profile API logic)
        console.log("Fetching profile for user...")
        const profileUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { profile: true }
        })

        if (!profileUser) {
            throw new Error("User not found after creation!")
        }
        console.log("Profile User found:", profileUser.email)

        // 3. Test dependant counts
        const counts = await Promise.all([
            prisma.request.count({ where: { clientId: user.id } }),
            prisma.review.count({ where: { targetId: user.id } }),
            prisma.favorite.count({ where: { userId: user.id } })
        ])
        console.log("Counts:", counts)

        console.log("SUCCESS: Flow works for fresh user.")

    } catch (e) {
        console.error("FLOW FAILED:")
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
