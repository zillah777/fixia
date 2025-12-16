"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
    Menu,
    LogOut,
    Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import {
    professionalSidebarItems,
    clientSidebarItems,
    professionalAvatarItems,
    clientAvatarItems,
    subscriptionItem
} from "@/config/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout, isLoading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    // Aggressive redirect removed in favor of Middleware protection
    // and AuthProvider resilience.

    // Professional Subscription Enforcement
    useEffect(() => {
        // ... (keep subscription logic if any, currently empty in view)
    }, [user, pathname])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="h-4 w-32 bg-muted rounded" />
                </div>
            </div>
        )
    }

    // If no user after loading (and middleware didn't catch it), 
    // we should render a fallback or allow the UI to handle null user gracefully.
    // However, for now, let's assume if user is null here, it's a real issue,
    // but we won't auto-redirect to avoid the "flash" issue the user hated.
    if (!user) {
        // Optional: Render a "Please login" empty state or let it fall through 
        // so the user sees *something* instead of a hard redirect loop.
        // But effectively, if we have Middleware, we shouldn't reach here without a session usually.
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
                <div className="relative h-12 w-32">
                    <Image
                        src="/logo.png"
                        alt="Fixia Logo"
                        fill
                        className="object-contain"
                        sizes="128px"
                    />
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r-0 bg-background/95 backdrop-blur-xl">
                        <div className="flex flex-col h-full overflow-y-auto">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Menú Dashboard</SheetTitle>
                                <SheetDescription>Navegación principal del panel de control</SheetDescription>
                            </SheetHeader>
                            <div className="p-6">
                                <div className="relative h-12 w-36 mb-4">
                                    <Image
                                        src="/logo.png"
                                        alt="Fixia Logo"
                                        fill
                                        className="object-contain"
                                        sizes="160px"
                                    />
                                </div>
                                {user && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="mt-2 flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} className="object-cover" />
                                                    <AvatarFallback className="bg-muted text-gray-500 font-medium">
                                                        {user.name?.substring(0, 2).toUpperCase() || "US"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</span>
                                                </div>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-56">
                                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {(user.role === "PROFESSIONAL" ? professionalAvatarItems : clientAvatarItems).map((item) => (
                                                <DropdownMenuItem key={item.href} asChild>
                                                    <Link href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-2 cursor-pointer">
                                                        <item.icon className="h-4 w-4" />
                                                        {item.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Cerrar Sesión
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <nav className="flex flex-col px-4 gap-1 pb-6">
                                {(user?.role === "PROFESSIONAL" ? professionalSidebarItems : clientSidebarItems).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                                            pathname === item.href
                                                ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                                {/* Conditional Subscription Item */}
                                {((user?.role === "PROFESSIONAL" && user?.subscriptionStatus !== "active") ||
                                    (user?.role === "CLIENT")) && (
                                        <Link
                                            href={subscriptionItem.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                                                pathname === subscriptionItem.href
                                                    ? "bg-black text-white shadow-lg shadow-black/20 scale-[1.02]"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <subscriptionItem.icon className="h-5 w-5" />
                                            {subscriptionItem.label}
                                        </Link>
                                    )}
                                <div className="my-2 border-t border-border/50" />
                                <Link href="/" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start gap-4 px-4 rounded-2xl h-10 text-muted-foreground hover:text-foreground">
                                        <Home className="h-5 w-5" />
                                        Volver al Inicio
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-4 px-4 rounded-2xl h-10 text-destructive hover:text-destructive hover:bg-destructive/5"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="ml-2">Cerrar Sesión</span>
                                </Button>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Floating Sidebar */}
            <aside className="hidden md:flex flex-col w-72 p-6 fixed h-screen">
                <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
                    <div className="p-8 pb-4">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="relative h-12 w-auto aspect-[3/1]">
                                <Image
                                    src="/logo.png"
                                    alt="Fixia Logo"
                                    fill
                                    className="object-contain"
                                    sizes="128px"
                                />
                            </div>
                        </Link>



                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border/50 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={user.avatar || undefined} alt={user.name || "User"} className="object-cover" />
                                            <AvatarFallback className="bg-white text-gray-500 font-medium">
                                                {user.name?.substring(0, 2).toUpperCase() || "US"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-sm truncate">{user.name}</span>
                                            <span className="text-xs text-muted-foreground truncate">{user.role === 'PROFESSIONAL' ? 'Profesional' : 'Cliente'}</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {(user.role === "PROFESSIONAL" ? professionalAvatarItems : clientAvatarItems).map((item) => (
                                        <DropdownMenuItem key={item.href} asChild>
                                            <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                            Menu Principal
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                        {(user?.role === "PROFESSIONAL" ? professionalSidebarItems : clientSidebarItems).map((item) => (
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
                        {/* Conditional Subscription Item */}
                        {((user?.role === "PROFESSIONAL" && user?.subscriptionStatus !== "active") ||
                            (user?.role === "CLIENT")) && (
                                <Link
                                    href={subscriptionItem.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group",
                                        pathname === subscriptionItem.href
                                            ? "bg-black text-white shadow-lg shadow-black/25 translate-x-1"
                                            : "text-muted-foreground hover:bg-gray-100 hover:text-foreground hover:translate-x-1"
                                    )}
                                >
                                    <subscriptionItem.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", pathname === subscriptionItem.href ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                                    {subscriptionItem.label}
                                </Link>
                            )}
                    </nav>

                    <div className="p-4 mt-auto border-t border-border/50 bg-gray-50/50 flex-shrink-0">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-xl h-11"
                            onClick={() => logout()}
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 p-3 sm:p-4 md:p-8 pt-24 sm:pt-28 md:pt-8 min-h-screen w-full max-w-[100vw] overflow-x-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
