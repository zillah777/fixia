const { PrismaClient } = require('@prisma/client')
// Use direct string for DB URL to avoid env issues if needed, or rely on .env
const prisma = new PrismaClient()

async function checkUser(label, userId) {
    console.log(`\n--- Checking ${label}: ${userId} ---`)
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            console.log("User not found")
            return
        }

        console.log(`Name: ${user.name}`)
        console.log(`Avatar: "${user.avatar}" (Type: ${typeof user.avatar})`)
        console.log(`Has Avatar: ${Boolean(user.avatar && user.avatar.trim() !== "")}`)
        console.log(`Role: ${user.role}`)
    } catch (e) {
        console.error("Error checking user:", e.message)
    }
}

async function main() {
    await checkUser("Professional", 'dfe5dc61-ae5b-4fb5-bb4e-a53f0c3d5786')
    await checkUser("Client", 'cae2c8ec-a2dc-41d0-8469-a71f1686e827')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
