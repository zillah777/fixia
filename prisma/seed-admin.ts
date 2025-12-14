import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fixia.app' },
        update: {},
        create: {
            email: 'admin@fixia.app',
            name: 'Admin Fixia',
            password,
            role: 'ADMIN',
            status: 'ACTIVE'
        }
    })
    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
