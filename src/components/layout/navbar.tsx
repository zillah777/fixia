"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Bell, User, LogIn, Search, LayoutDashboard, Settings, LogOut, Shield, Briefcase, List, Heart } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { user, logout } = useAuth()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <header
                className={`sticky top-4 z-50 w-[95%] max-w-7xl mx-auto rounded-full border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 transition-all duration-200 ${isScrolled ? "shadow-lg shadow-primary/5" : ""
                    }`}
            >
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-4 mt-8">
                                    {/* Mobile Search */}
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar servicios..."
                                            className="pl-9 h-11"
                                        />
                                    </div>
                                    <Link href="/services" className="text-lg font-semibold">
                                        Servicios
                                    </Link>
                                    <Link href="/professionals" className="text-lg font-semibold">
                                        Profesionales
                                    </Link>
                                    {(!user || user.role === 'CLIENT') && (
                                        <Link href="/become-a-pro" className="w-full">
                                            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30">
                                                Únete a Fixia
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href="/pricing" className="text-lg font-semibold">
                                        Planes
                                    </Link>
                                    <Link href="/login" className="text-lg font-semibold">
                                        Iniciar Sesión
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Fixia Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain"
                            />
                        </Link>

                        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium flex-1">
                            <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Servicios
                            </Link>
                            <Link href="/professionals" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Profesionales
                            </Link>
                            {(!user || user.role === 'CLIENT') && (
                                <Link href="/become-a-pro">
                                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                                        Únete a Fixia
                                    </Button>
                                </Link>
                            )}
                            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Planes
                            </Link>
                        </nav>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex items-center gap-2 mr-4">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar servicios..."
                                    className="pl-9 h-9 text-sm rounded-full bg-background/60"
                                />
                            </div>
                        </div>

                    </div>

                    {/* User Menu */}
                    {user ? (
                        <>
                            <NotificationCenter />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full relative h-9 w-9 border border-muted-foreground/20">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name || "User"} />
                                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>

                                    {user.role === 'ADMIN' && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer">
                                                <Shield className="mr-2 h-4 w-4" />
                                                Panel Admin
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {user.role === 'PROFESSIONAL' && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/services" className="cursor-pointer">
                                                    <Briefcase className="mr-2 h-4 w-4" />
                                                    Mis Servicios
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/leads" className="cursor-pointer">
                                                    <Search className="mr-2 h-4 w-4" />
                                                    Oportunidades
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {user.role === 'CLIENT' && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/requests" className="cursor-pointer">
                                                    <List className="mr-2 h-4 w-4" />
                                                    Mis Solicitudes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/favorites" className="cursor-pointer">
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Favoritos
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Configuración
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                        onClick={() => logout()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="hidden md:block text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30">
                                    Únete a Fixia
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    )
}
