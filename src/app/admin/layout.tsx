import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminLayoutClient from "./admin-layout-client"

export const dynamic = 'force-dynamic'

/**
 * SECURITY: Server-side authentication check
 * This component runs on the server and verifies admin access BEFORE rendering
 * Works in conjunction with middleware for defense-in-depth protection
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Get current session on the server
    const session = await getSession()

    // Verify user is authenticated
    if (!session) {
        redirect("/login")
    }

    // Verify user has ADMIN role
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    // User is authorized - render the admin layout with client-side interactivity
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    )
}
