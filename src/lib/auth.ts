import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// SECURITY: Validate JWT secrets at startup to prevent runtime failures
const secretKey = process.env.JWT_SECRET;
if (!secretKey || secretKey.length < 32) {
    throw new Error(
        "FATAL: JWT_SECRET must be defined and >= 32 characters. " +
        "Use a cryptographically secure random string. " +
        "Generate with: openssl rand -base64 32"
    );
}

const key = new TextEncoder().encode(secretKey);

// ============================================================================
// SECURITY: Type-safe JWT payload structure
// Prevents accidental exposure of sensitive data in tokens
// ============================================================================
export interface SessionPayload {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    };
    iat?: number;
    exp?: number;
    [key: string]: any;
}

/**
 * SECURITY: Encrypt JWT token with short expiration time (15 minutes)
 * Short-lived tokens reduce damage from token theft.
 * Refresh token is used for longer-lived access.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15 minutes") // Short-lived access token
        .sign(key);
}

/**
 * SECURITY: Decrypt and verify JWT token with safe error handling
 * Returns null on any verification failure to prevent information leakage.
 * Never exposes token details in error messages.
 */
export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        if (!input || typeof input !== "string") {
            return null;
        }

        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });

        // Validate critical claims exist
        const user = (payload as any).user;
        if (
            !user?.id ||
            !user?.email ||
            !user?.role
        ) {
            return null;
        }

        return payload as SessionPayload;
    } catch (error) {
        // Log security events without exposing token details
        if (error instanceof Error) {
            console.warn(`[AUTH_WARNING] Token verification failed: ${error.message}`);
        }
        return null;
    }
}

/**
 * SECURITY: Set secure HTTP-only cookies for session
 * Follows OWASP guidelines:
 * - HttpOnly: Prevents JavaScript from accessing the cookie (prevents XSS token theft)
 * - Secure: Only transmitted over HTTPS (prevents MITM)
 * - SameSite=Strict: Prevents CSRF attacks
 * - Path: Restricts cookie scope to minimize exposure
 */
export async function setSessionCookie(
    token: string,
    response: NextResponse
): Promise<void> {
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set({
        name: "session",
        value: token,
        httpOnly: true, // Prevent XSS token theft
        secure: isProduction, // HTTPS only in production
        sameSite: "strict", // Strict CSRF protection
        path: "/",
        maxAge: 15 * 60, // 15 minutes (match token expiration)
    });
}

/**
 * SECURITY: Clear authentication cookies on logout
 * Removes all session data from client.
 */
export async function clearSessionCookie(response: NextResponse): Promise<void> {
    response.cookies.set({
        name: "session",
        value: "",
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });
}

/**
 * SECURITY: Get current session from cookies with validation
 * Used in Server Components and API routes to verify authentication.
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }

    return await decrypt(token);
}

/**
 * SECURITY: Logout user by clearing session cookies
 */
export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
