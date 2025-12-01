import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt, SessionPayload } from '@/lib/auth'

/**
 * SECURITY: Middleware for protecting routes and validating sessions
 * Runs on every request matching the config below
 *
 * Responsibilities:
 * - Validate JWT tokens
 * - Protect authenticated routes
 * - Redirect unauthenticated users
 * - Log security events
 */
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // =========================================================================
    // PROTECTED ROUTES - Require authentication
    // =========================================================================
    const protectedRoutes = ['/dashboard', '/profile', '/portfolio']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // =========================================================================
    // AUTH ROUTES - Redirect authenticated users away
    // =========================================================================
    const authRoutes = ['/login', '/register']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // =========================================================================
    // STEP 1: Get and validate session token
    // =========================================================================
    const sessionToken = request.cookies.get('session')?.value

    let session: SessionPayload | null = null

    if (sessionToken) {
        // SECURITY: Validate token signature and expiration
        session = await decrypt(sessionToken)

        if (!session) {
            // Token is invalid or expired
            console.warn('[MIDDLEWARE_AUTH] Invalid session token')

            // Clear invalid token
            const response = NextResponse.next()
            response.cookies.delete('session')

            // If accessing protected route, redirect to login
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            return response
        }
    }

    // =========================================================================
    // STEP 2: Handle protected routes
    // =========================================================================
    if (isProtectedRoute) {
        if (!session) {
            // SECURITY: Log unauthorized access attempts
            console.warn('[MIDDLEWARE_AUTH] Unauthorized access to protected route', {
                pathname,
                ip: request.headers.get('x-forwarded-for') || 'unknown',
            })

            return NextResponse.redirect(new URL('/login', request.url))
        }

        // SECURITY: Add session data to request headers for use in route handlers
        const response = NextResponse.next()
        response.headers.set('x-user-id', session.user.id)
        response.headers.set('x-user-role', session.user.role)

        return response
    }

    // =========================================================================
    // STEP 3: Handle auth routes (redirect authenticated users)
    // =========================================================================
    if (isAuthRoute && session) {
        // User is already logged in
        if (session.user.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // =========================================================================
    // STEP 4: Public routes - Allow access
    // =========================================================================
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         *
         * This allows API routes to be handled separately
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}

