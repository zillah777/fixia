import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return new NextResponse("Email is required", { status: 400 });
        }

        // Here you would typically save to database or send to newsletter service (Resend, Mailchimp, etc.)
        // For now, we mock success
        console.log(`Newsletter subscription: ${email}`);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        console.error("Newsletter error:", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
