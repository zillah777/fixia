import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"

export const dynamic = 'force-dynamic';

// Validation schema for certification review
const certificationReviewSchema = z.object({
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
      console.warn(`[ADMIN_CERTIFICATION] Unauthorized access attempt: ${session?.user?.id}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, adminNote } = certificationReviewSchema.parse(body)

    // Get existing certification
    const existingCertification = await prisma.certificationVerification.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!existingCertification) {
      return NextResponse.json(
        { error: "Certification request not found" },
        { status: 404 }
      )
    }

    // Update certification request
    const certification = await prisma.certificationVerification.update({
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

    // If approved, update user profile and notify
    if (status === "APPROVED") {
      await prisma.$transaction(async (tx) => {
        const userProfile = await tx.profile.findUnique({
          where: { userId: certification.userId }
        })

        if (userProfile) {
          let badges: string[] = []
          try {
            const parsed = JSON.parse(userProfile.badges || "[]")
            // Handle both legacy string array and the new object-based attempt (though we'll normalize to strings)
            badges = Array.isArray(parsed) ? parsed.map(b => typeof b === 'string' ? b : (b.type === 'certification' ? 'CERTIFIED' : '')) : []
            badges = badges.filter(Boolean)
          } catch (e) {
            console.error("Error parsing badges:", e)
          }

          if (!badges.includes("CERTIFIED")) {
            badges.push("CERTIFIED")
          }

          await tx.profile.update({
            where: { userId: certification.userId },
            data: { badges: JSON.stringify(badges) }
          })
        }

        // Notification
        await tx.notification.create({
          data: {
            userId: certification.userId,
            type: "SYSTEM",
            message: `¡Tu certificación "${existingCertification.title}" ha sido aprobada!`,
            actionUrl: "/dashboard/settings?tab=certifications"
          }
        })
      })

      console.info('[ADMIN_CERTIFICATION] Approved certification', {
        certificationId: id,
        userId: certification.userId,
        title: existingCertification.title
      })
    } else if (status === "REJECTED") {
      // Notify Rejection
      await prisma.notification.create({
        data: {
          userId: certification.userId,
          type: "SYSTEM",
          message: `Tu certificación "${existingCertification.title}" ha sido rechazada. Nota: ${adminNote || 'Sin detalles adicional'}`,
          actionUrl: "/dashboard/settings?tab=certifications"
        }
      })

      console.warn('[ADMIN_CERTIFICATION] Rejected certification', {
        certificationId: id,
        userId: certification.userId,
        reason: adminNote
      })
    }

    return NextResponse.json({
      success: true,
      certification,
      message: `Certification ${status === 'APPROVED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'updated'} successfully`
    })
  } catch (error) {
    console.error("[ADMIN_CERTIFICATION_PATCH_ERROR]", error)

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession()

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certification = await prisma.certificationVerification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: {
              select: {
                yearsExperience: true,
              }
            }
          }
        }
      }
    })

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(certification)
  } catch (error) {
    console.error("[ADMIN_CERTIFICATION_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
