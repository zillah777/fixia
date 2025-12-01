import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session || session.payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const requests = await prisma.verificationRequest.findMany({
            where: { status: "PENDING" },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                bio: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(requests)
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
        const { id, action, reason } = body // action: "APPROVE" | "REJECT"

        if (!id || !action) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const verificationRequest = await prisma.verificationRequest.findUnique({
            where: { id }
        })

        if (!verificationRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        // Atomic Transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Request Status
            const updatedRequest = await tx.verificationRequest.update({
                where: { id },
                data: {
                    status: action === "APPROVE" ? "APPROVED" : "REJECTED",
                    adminNote: reason
                }
            })

            // 2. If Approved, Update User Profile Badges and Trust Score
            if (action === "APPROVE") {
                const userProfile = await tx.profile.findUnique({
                    where: { userId: verificationRequest.userId }
                })

                if (userProfile) {
                    const currentBadges = userProfile.badges || []
                    if (!currentBadges.includes("VERIFIED")) {
                        await tx.profile.update({
                            where: { userId: verificationRequest.userId },
                            data: {
                                badges: [...currentBadges, "VERIFIED"],
                                trustScore: { increment: 20 } // Bonus for verification
                            }
                        })
                    }
                }
            }

            // 3. Create Notification for User
            await tx.notification.create({
                data: {
                    userId: verificationRequest.userId,
                    type: "SYSTEM",
                    message: action === "APPROVE"
                        ? "¡Felicidades! Tu identidad ha sido verificada. Ahora tienes la insignia de Verificado."
                        : `Tu solicitud de verificación fue rechazada. Motivo: ${reason || "Documentación ilegible"}`,
                    isRead: false
                }
            })

            return updatedRequest
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error processing verification:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
