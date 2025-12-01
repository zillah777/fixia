import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Users, ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    // 1. Security Guard: Check if user is logged in and is ADMIN
    if (!session || session.payload.role !== "ADMIN") {
        redirect("/dashboard") // Redirect non-admins to normal dashboard
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-black text-white hidden md:flex flex-col fixed h-full z-50">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Fixia Admin
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Backoffice Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                            <Users className="mr-2 h-4 w-4" />
                            Usuarios
                        </Button>
                    </Link>
                    <Link href="/admin/verifications">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Verificaciones
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">{session.payload.name}</p>
                            <p className="text-xs text-gray-400">Administrador</p>
                        </div>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                            <LogOut className="mr-2 h-4 w-4" />
                            Volver a App
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
