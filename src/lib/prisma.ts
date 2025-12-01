import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Fix for localhost resolution on Windows/Node 18+
    const url = process.env.DATABASE_URL
    if (url && url.includes('localhost')) {
        process.env.DATABASE_URL = url.replace('localhost', '127.0.0.1')
    }
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
