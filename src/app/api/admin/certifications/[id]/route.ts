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
  { params }: { params: { id: string } }
) {
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
      where: { id: params.id },
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
      where: { id: params.id },
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

    // If approved, add badge to user profile
    if (status === "APPROVED") {
      const userProfile = await prisma.profile.findUnique({
        where: { userId: certification.userId }
      })

      if (userProfile) {
        const badges = userProfile.badges ? JSON.parse(userProfile.badges) : []

        // Check if certification badge already exists
        const certBadgeExists = badges.some((b: any) => b.id === `cert-${existingCertification.id}`)

        if (!certBadgeExists) {
          badges.push({
            id: `cert-${existingCertification.id}`,
            name: `Certificado: ${existingCertification.title}`,
            icon: 'certificate',
            color: 'blue',
            type: 'certification'
          })

          await prisma.profile.update({
            where: { userId: certification.userId },
            data: { badges: JSON.stringify(badges) }
          })
        }
      }

      console.info('[ADMIN_CERTIFICATION] Approved certification', {
        certificationId: params.id,
        userId: certification.userId,
        title: existingCertification.title,
        userName: certification.user?.name
      })
    } else if (status === "REJECTED") {
      console.warn('[ADMIN_CERTIFICATION] Rejected certification', {
        certificationId: params.id,
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    // Check if user is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const certification = await prisma.certificationVerification.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: {
              select: {
                category: true,
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
