import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// SECURITY: Next.js Middleware for Route Protection with RBAC
// Protects admin routes, dashboard routes, and professional-only routes
// Runs on every request before reaching route handlers
// Also sets RLS context for database-level security
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session token from cookies
    const token = request.cookies.get("session")?.value;

    // =========================================================================
    // RLS CONTEXT: Set user identification for database security
    // =========================================================================
    // These values are used by PostgreSQL RLS policies to enforce row-level access control
    // They're stored in thread-local storage and set by the Prisma middleware
    const rlsContext = {
        userId: null as string | null,
        userRole: null as string | null
    };

    // =========================================================================
    // PUBLIC AUTH ROUTES - Redirect authenticated users to dashboard
    // =========================================================================
    const publicAuthRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/(auth)",
    ];

    const isPublicAuthRoute = publicAuthRoutes.some((route) => {
        if (route.includes("*")) {
            const pattern = route.replace("*", "(.+)");
            return new RegExp(`^${pattern}$`).test(pathname);
        }
        return pathname.startsWith(route);
    });

    // If user is authenticated and trying to access public auth routes
    if (isPublicAuthRoute && token) {
        // Verify token is valid
        const session = await decrypt(token);

        if (session) {
            // Set RLS context for authenticated user
            rlsContext.userId = session.user.id;
            rlsContext.userRole = session.user.role;
            (globalThis as any).__rls_context = rlsContext;

            // User is authenticated - redirect to appropriate dashboard
            const userRole = session.user.role;
            const dashboardUrl = userRole === "ADMIN" ? "/admin" : "/dashboard";
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
    }

    // =========================================================================
    // PROTECTED ROUTES - Require authentication
    // =========================================================================
    const protectedRoutes = [
        "/admin",
        "/dashboard",
        "/matches",
        "/professionals/*/edit",
    ];

    // Check if current path is protected
    const isProtected = protectedRoutes.some((route) => {
        if (route.includes("*")) {
            // Pattern matching for dynamic routes
            const pattern = route.replace("*", "(.+)");
            return new RegExp(`^${pattern}$`).test(pathname);
        }
        return pathname.startsWith(route);
    });

    if (!isProtected) {
        // Public routes - allow access
        return NextResponse.next();
    }

    if (!token) {
        // No session - redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify and decrypt session token
    const session = await decrypt(token);

    if (!session) {
        // Invalid session - redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // =========================================================================
    // RLS CONTEXT: Set authenticated user context
    // =========================================================================
    // Store user ID and role for RLS policies to use during database queries
    rlsContext.userId = session.user.id;
    rlsContext.userRole = session.user.role;
    (globalThis as any).__rls_context = rlsContext;

    // =========================================================================
    // ROLE-BASED ACCESS CONTROL
    // =========================================================================

    const userRole = session.user.role;

    // Admin routes - only ADMIN role allowed
    if (pathname.startsWith("/admin")) {
        if (userRole !== "ADMIN") {
            // Not admin - redirect to dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Admin access granted
        return NextResponse.next();
    }

    // Professional edit routes - only PROFESSIONAL role allowed
    if (pathname.includes("/professionals/") && pathname.includes("/edit")) {
        if (userRole !== "PROFESSIONAL") {
            // Not professional - redirect to dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Professional access granted
        return NextResponse.next();
    }

    // Dashboard and protected routes - any authenticated user allowed
    if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/matches")
    ) {
        // User is authenticated - allow access
        return NextResponse.next();
    }

    // Fallback - allow access (authenticated user)
    return NextResponse.next();
}

// Configure which routes use middleware
// Middleware runs on all routes except api, static files, and favicon
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
