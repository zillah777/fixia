import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"
import { notifyUser } from "@/lib/notifications"

export const dynamic = 'force-dynamic';

// Validation schema for verification review
const verificationReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING'], {
    errorMap: () => ({ message: 'Status must be APPROVED, REJECTED, or PENDING' })
  }),
  adminNote: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession()

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      console.warn(`[ADMIN_VERIFICATION] Unauthorized access attempt: ${session?.user?.id}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, adminNote } = verificationReviewSchema.parse(body)

    // Get existing verification
    const existingVerification = await prisma.verificationRequest.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingVerification) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      )
    }

    // Update verification request
    const verification = await prisma.verificationRequest.update({
      where: { id },
      data: {
        status,
        adminNote,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    // If approved, update user's verification status and permissions
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          canCreateServices: true,
          listingVisible: true,
          canReceiveBookings: true
        }
      })
      console.info('[ADMIN_VERIFICATION] Approved verification', {
        verificationId: id,
        userId: verification.userId,
        userName: verification.user?.name
      })

      // Notify User
      await notifyUser({
        userId: verification.userId,
        type: "SYSTEM",
        title: "¡Identidad Verificada!",
        message: "Tu solicitud de verificación de identidad ha sido aprobada. Ya podés disfrutar de todos los beneficios.",
        actionUrl: "/dashboard"
      })
    } else if (status === "REJECTED") {
      // Reset permissions if rejected
      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          canCreateServices: false,
          listingVisible: false,
          canReceiveBookings: false
        }
      })
      console.warn('[ADMIN_VERIFICATION] Rejected verification', {
        verificationId: id,
        userId: verification.userId,
        reason: adminNote
      })

      // Notify User
      await notifyUser({
        userId: verification.userId,
        type: "SYSTEM",
        title: "Verificación Rechazada",
        message: `Tu solicitud de verificación fue rechazada por la siguiente razón: ${adminNote || 'No se especificó razón'}. Por favor revisá tus documentos e intentá de nuevo.`,
        actionUrl: "/dashboard/settings"
      })
    }

    return NextResponse.json({
      success: true,
      verification,
      message: `Verification ${status === 'APPROVED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'updated'} successfully`
    })
  } catch (error) {
    console.error("[ADMIN_VERIFICATION_PATCH_ERROR]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
