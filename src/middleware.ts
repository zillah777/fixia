import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

/**
 * SECURITY: Next.js Middleware for Route Protection
 * Enforces authentication and role-based access control (RBAC) at the application level
 *
 * This is a critical security layer that protects routes BEFORE they reach the application
 * Prevents unauthorized access even if client-side checks are bypassed
 *
 * Protected Routes:
 * - /admin/* → Requires ADMIN role
 * - /dashboard/* → Requires authentication (CLIENT, PROFESSIONAL, or ADMIN)
 * - /professionals/[id]/edit → Requires PROFESSIONAL role
 */

// Define protected routes and their required roles
const protectedRoutes: {
  pattern: RegExp;
  requiredRole?: string;
  requiresAuth: boolean;
}[] = [
  // Admin routes - ADMIN role required
  {
    pattern: /^\/admin/,
    requiredRole: "ADMIN",
    requiresAuth: true,
  },
  // Dashboard routes - Any authenticated user
  {
    pattern: /^\/dashboard/,
    requiresAuth: true,
  },
  // Professional edit routes - PROFESSIONAL role required
  {
    pattern: /^\/professionals\/[^/]+\/edit/,
    requiredRole: "PROFESSIONAL",
    requiresAuth: true,
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route requires protection
  const protectedRoute = protectedRoutes.find((route) =>
    route.pattern.test(pathname)
  );

  if (!protectedRoute) {
    // Route does not require protection
    return NextResponse.next();
  }

  // Extract session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    // No session found - redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decrypt and verify session
  const session = await decrypt(sessionCookie);

  if (!session) {
    // Invalid or expired session - redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check role-based access
  if (protectedRoute.requiredRole) {
    const userRole = session.user?.role;

    if (userRole !== protectedRoute.requiredRole) {
      // User lacks required role
      // Admin can access everything, others redirected to dashboard
      if (userRole === "ADMIN") {
        return NextResponse.next();
      }

      // Redirect based on user role
      if (userRole === "PROFESSIONAL") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Default redirect for CLIENT role
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Authorization successful - allow request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes use this middleware
 * Using matcher is more efficient than checking every route
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
