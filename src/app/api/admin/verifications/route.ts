import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { VerificationService } from "@/services/verification.service"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session || session.payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        const result = await VerificationService.getPendingRequests(page, limit)

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching verifications:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession()
        if (!session || session.payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { id, action, reason } = body

        if (!id || !action) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        if (action !== "APPROVE" && action !== "REJECT") {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }

        const result = await VerificationService.processRequest(id, action, reason)

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error processing verification:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
