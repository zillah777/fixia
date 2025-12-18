import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Testing database connection...")
    // Mimic the behavior in lib/prisma.ts just in case
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')) {
        process.env.DATABASE_URL = process.env.DATABASE_URL.replace('localhost', '127.0.0.1')
    }
    console.log("DATABASE_URL:", process.env.DATABASE_URL)

    try {
        await prisma.$connect()
        console.log("Connected successfully!")

        // Exact query from ticker/route.ts
        const requests = await prisma.request.groupBy({
            by: ['categoryId'],
            where: {
                status: 'OPEN'
            },
            _count: {
                _all: true
            }
        })
        console.log("Requests groupBy result:", requests)

    } catch (e) {
        console.error("Connection failed or Query failed:")
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
