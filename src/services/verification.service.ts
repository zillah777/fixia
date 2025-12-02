import prisma from "@/lib/prisma"

export class VerificationService {
    static async getPendingRequests(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit

        const [requests, total] = await Promise.all([
            prisma.verificationRequest.findMany({
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
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.verificationRequest.count({
                where: { status: "PENDING" }
            })
        ])

        return {
            data: requests,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    static async processRequest(id: string, action: "APPROVE" | "REJECT", reason?: string) {
        return await prisma.$transaction(async (tx) => {
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
                    where: { userId: updatedRequest.userId }
                })

                if (userProfile) {
                    let currentBadges: string[] = []
                    try {
                        currentBadges = userProfile.badges ? JSON.parse(userProfile.badges) : []
                    } catch (e) {
                        console.error("Error parsing badges JSON:", e)
                        currentBadges = []
                    }

                    if (!currentBadges.includes("VERIFIED")) {
                        await tx.profile.update({
                            where: { userId: updatedRequest.userId },
                            data: {
                                badges: JSON.stringify([...currentBadges, "VERIFIED"]),
                                trustScore: { increment: 20 } // Bonus for verification
                            }
                        })
                    }
                }
            }

            // 3. Create Notification for User
            await tx.notification.create({
                data: {
                    userId: updatedRequest.userId,
                    type: "SYSTEM",
                    message: action === "APPROVE"
                        ? "¡Felicidades! Tu identidad ha sido verificada. Ahora tienes la insignia de Verificado."
                        : `Tu solicitud de verificación fue rechazada. Motivo: ${reason || "Documentación ilegible"}`,
                    isRead: false
                }
            })

            return updatedRequest
        })
    }
}
