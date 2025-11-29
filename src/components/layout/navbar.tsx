"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Bell, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

// Datos de búsqueda (reemplazar con datos dinámicos)
const SEARCH_DATA = [
    {
        category: "Servicios",
        items: [
            { id: "1", name: "Plomería", href: "/services/plomeria" },
            { id: "2", name: "Electricidad", href: "/services/electricidad" },
            { id: "3", name: "Limpieza", href: "/services/limpieza" },
            { id: "4", name: "Jardinería", href: "/services/jardineria" },
        ],
    },
    {
        category: "Páginas",
        items: [
            { id: "5", name: "Profesionales", href: "/professionals" },
            { id: "6", name: "Sobre Nosotros", href: "/about" },
            { id: "7", name: "Contacto", href: "/contact" },
            { id: "8", name: "Cómo Funciona", href: "/how-it-works" },
        ],
    },
]

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [notificationCount] = React.useState(3) // Reemplazar con dato dinámico

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Cmd+K shortcut
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <header
                className={`sticky top-4 z-50 w-[95%] max-w-7xl mx-auto rounded-full border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 transition-all duration-200 ${
                    isScrolled ? "shadow-lg shadow-black/5" : ""
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
                                    <Link href="/services" className="text-lg font-semibold">
                                        Servicios
                                    </Link>
                                    <Link href="/professionals" className="text-lg font-semibold">
                                        Profesionales
                                    </Link>
                                    <Link href="/become-a-pro" className="text-lg font-semibold">
                                        Únete a Fixia
                                    </Link>
                                    <Link href="/login" className="text-lg font-semibold">
                                        Iniciar Sesión
                                    </Link>
                                    <Link href="/pricing" className="text-lg font-semibold">
                                        Planes
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

                        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium flex-1">
                            <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Servicios
                            </Link>
                            <Link href="/professionals" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Profesionales
                            </Link>
                            <Link href="/become-a-pro" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Únete a Fixia
                            </Link>
                            <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Iniciar Sesión
                            </Link>
                            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Planes
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Button con Cmd+K - Only for authenticated users */}
                        <Button
                            variant="outline"
                            className="hidden md:inline-flex w-[200px] lg:w-[300px] justify-start text-muted-foreground"
                            onClick={() => setOpen(true)}
                        >
                            <span className="text-sm">Buscar servicios...</span>
                            <kbd className="ml-auto text-xs px-2 py-1 bg-muted rounded border border-border/40 font-mono">
                                ⌘K
                            </kbd>
                        </Button>

                        <ThemeToggle />

                        {/* Show user menu and notifications only when logged in */}
                        {/* TODO: Implement session check to show/hide authenticated elements */}
                        {/* <NotificationCenter />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt="@user" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Perfil</DropdownMenuItem>
                                <DropdownMenuItem>Mis Reservas</DropdownMenuItem>
                                <DropdownMenuItem>Configuración</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cerrar Sesión</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </div>
                </div>
            </header>

            {/* Command Dialog para búsqueda */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Buscar servicios, profesionales..." />
                <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    {SEARCH_DATA.map((group) => (
                        <CommandGroup key={group.category} heading={group.category}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    onSelect={() => {
                                        window.location.href = item.href
                                        setOpen(false)
                                    }}
                                >
                                    <span>{item.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}
