import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Health check endpoint for Docker healthchecks and monitoring
 * Returns 200 if database is connected and healthy
 * Returns 503 if database is down
 */
export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
            service: "fixia-api"
        })
    } catch (error) {
        console.error("[HEALTH CHECK] Database connection failed:", error)

        return NextResponse.json(
            {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                database: "disconnected",
                service: "fixia-api",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 503 }
        )
    }
}
