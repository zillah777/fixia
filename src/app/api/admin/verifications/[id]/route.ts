import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Update verification request status
    const verification = await prisma.verificationRequest.update({
      where: { id: params.id },
      data: { status }
    })

    // If approved, update user's canCreateServices flag
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { 
          canCreateServices: true,
          listingVisible: true,
          canReceiveBookings: true
        }
      })
    }

    return NextResponse.json(verification)
  } catch (error) {
    console.error("[ADMIN_VERIFICATION_PATCH_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
