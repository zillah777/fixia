/**
 * SECURITY: Database Context Helpers for RLS Enforcement
 *
 * These functions help set up the RLS context in API routes and server actions
 * where the Next.js middleware may not automatically set the context.
 */

import { getSession } from './auth'
import { rlsStorage } from './prisma'

/**
 * Set RLS context from session data
 * Call this in API routes or server actions to ensure RLS policies are enforced
 */
export async function setRLSContext(): Promise<{ userId: string | null; userRole: string | null }> {
    const session = await getSession()

    const userId = session?.user?.id || null
    const userRole = session?.user?.role || null

    const rlsContext = {
        userId,
        userRole
    }

        // Set globally for non-AsyncLocalStorage environments (like middleware)
        ; (globalThis as any).__rls_context = rlsContext

    return rlsContext
}

/**
 * Run block with RLS context (Thread-safe via AsyncLocalStorage)
 */
export async function runWithRLS<T>(fn: () => Promise<T>): Promise<T> {
    const context = await setRLSContext()
    return rlsStorage.run(context, fn)
}

/**
 * Get current RLS context (for debugging/verification)
 */
export function getRLSContext() {
    return rlsStorage.getStore() || (globalThis as any).__rls_context || {
        userId: null,
        userRole: null
    }
}

/**
 * Clear RLS context (useful for cleanup in certain scenarios)
 */
export function clearRLSContext() {
    (globalThis as any).__rls_context = {
        userId: null,
        userRole: null
    }
}

/**
 * Verify user has access to resource
 * Useful for additional client-side validation before database operations
 *
 * Note: This is NOT a replacement for RLS - RLS is the primary security layer
 */
export async function verifyUserCanAccess(
    requiredRole?: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN'
): Promise<boolean> {
    const session = await getSession()

    if (!session?.user) {
        return false
    }

    if (requiredRole && session.user.role !== requiredRole) {
        return false
    }

    return true
}

/**
 * Ensure RLS context is set and user is authenticated
 * Throws error if not authenticated
 */
export async function requireAuth() {
    const session = await getSession()

    if (!session?.user) {
        throw new Error('Unauthorized: User not authenticated')
    }

    await setRLSContext()

    return session.user
}

/**
 * Ensure RLS context is set and user has specific role
 * Throws error if not authenticated or doesn't have required role
 */
export async function requireRole(requiredRole: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN') {
    const user = await requireAuth()

    if (user.role !== requiredRole) {
        throw new Error(`Unauthorized: Required role ${requiredRole}`)
    }

    return user
}
