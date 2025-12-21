import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function checkUser(label: string, userId: string) {
    console.log(`\n--- Checking ${label}: ${userId} ---`)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            verificationRequest: true,
            certifications: true
        }
    })

    if (!user) {
        console.log("User not found")
        return
    }

    console.log(`Name: ${user.name}`)
    console.log(`Avatar: "${user.avatar}" (Type: ${typeof user.avatar})`)
    console.log(`Has Avatar: ${Boolean(user.avatar && user.avatar.trim() !== "")}`)
    console.log(`Role: ${user.role}`)
}

async function main() {
    await checkUser("Professional", 'dfe5dc61-ae5b-4fb5-bb4e-a53f0c3d5786')
    await checkUser("Client", 'cae2c8ec-a2dc-41d0-8469-a71f1686e827')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
