import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await logout();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[AUTH_LOGOUT_ERROR]", error);
        return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 });
    }
}
