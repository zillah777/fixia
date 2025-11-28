import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return new NextResponse("Missing token", { status: 400 });
    }

    // In a real app:
    // 1. Verify token (JWT or DB lookup)
    // 2. Find user by token
    // 3. Update user status to ACTIVE or VERIFIED
    // 4. Invalidate token

    // For now, we simulate success and redirect to dashboard
    console.log(`Verifying account with token: ${token}`);

    // Redirect to a success page or dashboard with a query param
    return redirect('/dashboard?verified=true');
}
