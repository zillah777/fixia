import { PrismaClient } from '@prisma/client'
import { AsyncLocalStorage } from 'async_hooks'

// ============================================================================
// SECURITY: Row-Level Security (RLS) Context Storage
// ============================================================================
export const rlsStorage = new AsyncLocalStorage<{
    userId: string | null;
    userRole: string | null;
}>();

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const basePrisma = globalForPrisma.prisma ?? prismaClientSingleton()

// ============================================================================
// SECURITY: Prisma Client Extension for RLS
// ============================================================================
// This extension sets PostgreSQL session variables for RLS policies
// before every database operation to identify the current user.
const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ args, query }) {
                // Get current user context from AsyncLocalStorage
                // Fallback to globalThis for backward compatibility during transition
                const userContext = rlsStorage.getStore() || (globalThis as any).__rls_context || {
                    userId: null,
                    userRole: null
                }

                try {
                    // Set PostgreSQL session variables for RLS policies
                    if (userContext.userId && userContext.userRole) {
                        await basePrisma.$executeRawUnsafe(
                            `SELECT set_config('app.current_user_id', $1, true),
                                    set_config('app.current_user_role', $2, true)`,
                            userContext.userId,
                            userContext.userRole
                        )
                    } else {
                        // Clear context for anonymous access
                        await basePrisma.$executeRawUnsafe(
                            `SELECT set_config('app.current_user_id', '', true),
                                    set_config('app.current_user_role', '', true)`
                        )
                    }
                } catch (error) {
                    // Log but don't block - RLS will deny access if context is missing
                    console.error('[SECURITY] Failed to set RLS context:', error)
                }

                return query(args)
            },
        },
    },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma

export default prisma
