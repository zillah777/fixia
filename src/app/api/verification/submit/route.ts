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

        // TODO: Upload files to storage service (e.g., S3, Cloudinary)
        // For now, we'll just store the file names
        const idFrontUrl = `https://storage.example.com/${session.user.id}/${idFront.name}`
        const idBackUrl = `https://storage.example.com/${session.user.id}/${idBack.name}`
        const certificateUrl = certificate
            ? `https://storage.example.com/${session.user.id}/${certificate.name}`
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
