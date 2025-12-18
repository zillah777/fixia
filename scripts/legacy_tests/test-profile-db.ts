import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Testing Profile DB queries...")
    try {
        await prisma.$connect()
        console.log("Connected.")

        // 1. Try to find a non-existent user (mimic 'User not found' case)
        const randomId = "random-id-" + Math.random()
        console.log(`Searching for user with ID: ${randomId}`)
        const user = await prisma.user.findUnique({
            where: { id: randomId },
            include: { profile: true }
        })
        console.log("User result:", user) // Should be null

        // 2. If user were to be found (stubbed), verify dependent queries
        // We can't really test this easily without a real user, but we can test the Count queries with a fake ID
        // They should just return 0, not throw.
        console.log("Testing Count queries with fake ID...")
        const [projectsCount, reviewsCount, favoritesCount] = await Promise.all([
            prisma.request.count({ where: { clientId: randomId } }),
            prisma.review.count({ where: { targetId: randomId } }),
            prisma.favorite.count({ where: { userId: randomId } })
        ])
        console.log("Counts:", { projectsCount, reviewsCount, favoritesCount })

    } catch (e) {
        console.error("Query failed:")
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
