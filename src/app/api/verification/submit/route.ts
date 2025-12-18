import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession()

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const idFront = formData.get("idFront") as File
        const idBack = formData.get("idBack") as File
        const certificate = formData.get("certificate") as File | null

        if (!idFront || !idBack) {
            return NextResponse.json(
                { error: "Both ID front and back are required" },
                { status: 400 }
            )
        }

        const { uploadToCloudinary } = await import("@/lib/cloudinary")

        // Helper function to upload File to Cloudinary
        const uploadFile = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer())
            const timestamp = Date.now()
            const filename = `${file.name.split('.')[0]}_${timestamp}`
            const result = await uploadToCloudinary(buffer, filename, folder)
            return result.secure_url
        }

        const folder = `verifications/${session.user.id}`

        // Upload files to Cloudinary
        const idFrontUrl = await uploadFile(idFront, folder)
        const idBackUrl = await uploadFile(idBack, folder)
        const certificateUrl = certificate
            ? await uploadFile(certificate, folder)
            : null

        // Create or update verification request
        const verificationRequest = await prisma.verificationRequest.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                idFront: idFrontUrl,
                idBack: idBackUrl,
                certificationUrl: certificateUrl,
                status: "PENDING",
            },
            update: {
                idFront: idFrontUrl,
                idBack: idBackUrl,
                certificationUrl: certificateUrl,
                status: "PENDING",
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            verificationRequest,
        })
    } catch (error) {
        console.error("Error submitting verification:", error)
        return NextResponse.json(
            { error: "Error submitting verification" },
            { status: 500 }
        )
    }
}
