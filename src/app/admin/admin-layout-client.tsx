"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Verificaciones",
            href: "/admin/verifications",
            icon: ShieldCheck,
        },
        {
            title: "Usuarios",
            href: "/admin/users",
            icon: Users,
        },
        {
            title: "Configuración",
            href: "/admin/settings",
            icon: Settings,
        },
        {
            title: "Test Push",
            href: "/test-push",
            icon: Bell,
        },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 flex-col border-r bg-black text-white md:flex">
                <div className="flex h-16 items-center border-b border-gray-800 px-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <Image
                            src="/logo.png"
                            alt="Fixia Logo"
                            width={150}
                            height={45}
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-destructive">ADMIN</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                                pathname === item.href ? "bg-destructive text-white hover:bg-destructive/90" : "text-gray-400"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <div className="border-t border-gray-800 p-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-400 hover:bg-red-950/30 hover:text-red-300"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-gray-950 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                    <span className="font-bold">Admin Panel</span>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 md:hidden">
                        <div className="fixed inset-y-0 left-0 w-64 bg-black text-white p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/logo.png"
                                        alt="Fixia Logo"
                                        width={150}
                                        height={45}
                                        className="h-10 w-auto object-contain"
                                    />
                                    <span className="font-bold text-xl text-destructive">ADMIN</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                            <nav className="space-y-2 flex-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                                            pathname === item.href ? "bg-destructive" : "text-gray-400"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                            <div className="border-t border-gray-800 pt-4 mt-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-red-400 hover:bg-red-950/30 hover:text-red-300"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Sesión
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
