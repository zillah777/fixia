import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Fix for localhost resolution on Windows/Node 18+
    // const url = process.env.DATABASE_URL
    // if (url && url.includes('localhost')) {
    //     process.env.DATABASE_URL = url.replace('localhost', '127.0.0.1')
    // }
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// ============================================================================
// SECURITY: Middleware for Row-Level Security (RLS) Context
// ============================================================================
// This middleware sets PostgreSQL session variables for RLS policies
// to identify the current user and their role in the database layer
prisma.$use(async (params, next) => {
    // Only set context for operations - skip for introspection, etc.
    if (!params.action || params.action === 'findMany' || params.action === 'findFirst' ||
        params.action === 'findUnique' || params.action === 'create' || params.action === 'update' ||
        params.action === 'delete' || params.action === 'upsert') {

        // Get current user context from thread-local storage or request context
        // This will be set by middleware.ts before database operations
        const userContext = (globalThis as any).__rls_context || {
            userId: null,
            userRole: null
        }

        try {
            // Set PostgreSQL session variables for RLS policies
            // These can be accessed in RLS policies via current_setting()
            if (userContext.userId && userContext.userRole) {
                await prisma.$executeRawUnsafe(
                    `SELECT set_config('app.current_user_id', $1, true),
                            set_config('app.current_user_role', $2, true)`,
                    userContext.userId,
                    userContext.userRole
                )
            } else {
                // Clear context if no user logged in
                await prisma.$executeRawUnsafe(
                    `SELECT set_config('app.current_user_id', '', true),
                            set_config('app.current_user_role', '', true)`
                )
            }
        } catch (error) {
            console.error('Failed to set RLS context:', error)
        }
    }

    return next(params)
})

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
