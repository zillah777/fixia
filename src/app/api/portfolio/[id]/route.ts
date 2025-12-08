import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "PROFESSIONAL") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Get current portfolio
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { portfolioImages: true }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const currentPortfolio = JSON.parse(profile.portfolioImages || "[]");

        // Filter out the item to delete
        const updatedPortfolio = currentPortfolio.filter((item: any) => item.id !== id);

        // Update profile
        await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
                portfolioImages: JSON.stringify(updatedPortfolio)
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
