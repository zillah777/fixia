"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    Calendar,
    User,
    Settings,
    LogOut,
    Menu,
    Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Mis Solicitudes", href: "/dashboard/requests" },
    { icon: Calendar, label: "Reservas", href: "/dashboard/bookings" },
    { icon: User, label: "Perfil", href: "/dashboard/profile" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
                <span className="font-bold text-lg">Fixia</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r-0 bg-background/95 backdrop-blur-xl">
                        <div className="p-8">
                            <h2 className="font-bold text-2xl tracking-tight">Fixia</h2>
                        </div>
                        <nav className="flex flex-col px-4 gap-2">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                                        pathname === item.href
                                            ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                            <div className="my-4 border-t border-border/50" />
                            <Link href="/">
                                <Button variant="ghost" className="w-full justify-start gap-4 px-4 rounded-2xl h-12 text-muted-foreground hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    Volver al Inicio
                                </Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start gap-4 px-4 rounded-2xl h-12 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="h-5 w-5" />
                                Cerrar Sesión
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Floating Sidebar */}
            <aside className="hidden md:flex flex-col w-72 p-6 fixed h-screen">
                <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
                    <div className="p-8 pb-4">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Fixia</span>
                        </Link>

                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                            Menu Principal
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group",
                                    pathname === item.href
                                        ? "bg-black text-white shadow-lg shadow-black/25 translate-x-1"
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground hover:translate-x-1"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto border-t border-border/50 bg-gray-50/50">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11">
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
