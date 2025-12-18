# Implementaciones Concretas - FASE 1 (Código listo para copiar)

## 1. ServiceCard Mejorado ⭐

### Versión Actual
```tsx
// /src/components/service-card.tsx (línea 75-82)
<div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-md">
    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
        {rating}
    </span>
    <span className="text-xs text-muted-foreground">
        ({reviewsCount})
    </span>
</div>
```

### Versión Mejorada (Reemplazar el código anterior)
```tsx
// /src/components/service-card.tsx

// 1. Agregar import al inicio del archivo
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// 2. Crear componente helper para estrellas (agregar antes de ServiceCard)
function StarRating({ rating, reviewsCount }: { rating: number; reviewsCount: number }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="cursor-help">
                    <div className="flex items-center gap-1 bg-amber-500/15 px-2 py-1.5 rounded-lg hover:bg-amber-500/25 transition-colors">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 transition-colors ${
                                        i < Math.floor(rating)
                                            ? 'fill-amber-500 text-amber-500'
                                            : i < Math.ceil(rating)
                                            ? 'fill-amber-500/50 text-amber-500'
                                            : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
                {reviewsCount} reseñas verificadas
            </TooltipContent>
        </Tooltip>
    )
}

// 3. Reemplazar en el componente ServiceCard (línea 75-82)
// Cambiar de:
<div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-md">
    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
        {rating}
    </span>
    <span className="text-xs text-muted-foreground">
        ({reviewsCount})
    </span>
</div>

// A:
<StarRating rating={rating} reviewsCount={reviewsCount} />
```

**Beneficio**:
- Soporte para ratings parciales (4.5 ⭐)
- Tooltip con info de reseñas
- Mejor diseño visual
- Adaptado a light/dark mode

---

## 2. Footer Modernizado 🔧

### Cambios en `/src/components/layout/footer.tsx`

**Problema Actual**:
- Usa `bg-white` hardcoded (rompe dark mode)
- Sin separadores visuales
- Sin responsive collapses en mobile

### Solución - Reemplazar todo el componente:

```tsx
"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"

export function Footer() {
    const [openSections, setOpenSections] = useState({
        company: true,
        services: true,
        legal: true,
    })

    return (
        <footer className="bg-background border-t border-border/40 pt-16 pb-8">
            <div className="container px-4 mx-auto">
                {/* Newsletter Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 pb-16 border-b border-border/40">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                            Suscríbete para recibir notificaciones de nuevos profesionales
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="flex-1"
                        />
                        <Button size="sm" className="px-6">
                            Suscribirse
                        </Button>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {/* Logo Section */}
                    <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Fixia</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            La plataforma líder para conectar profesionales de confianza con clientes que valoran la calidad.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company Section */}
                    <FooterSection
                        title="Compañía"
                        items={[
                            { label: "Sobre Nosotros", href: "/about" },
                            { label: "Carreras", href: "/careers" },
                            { label: "Blog", href: "/blog" },
                            { label: "Prensa", href: "/press" },
                        ]}
                    />

                    {/* Services Section */}
                    <FooterSection
                        title="Servicios"
                        items={[
                            { label: "Plomería", href: "/services/plomeria" },
                            { label: "Electricidad", href: "/services/electricidad" },
                            { label: "Limpieza", href: "/services/limpieza" },
                            { label: "Ser Profesional", href: "/become-a-pro" },
                        ]}
                    />

                    {/* Legal Section */}
                    <FooterSection
                        title="Legal"
                        items={[
                            { label: "Términos y Condiciones", href: "/terms" },
                            { label: "Política de Privacidad", href: "/privacy" },
                            { label: "Cookies", href: "/cookies" },
                            { label: "Centro de Ayuda", href: "/help" },
                        ]}
                    />
                </div>

                {/* Bottom Footer */}
                <Separator className="my-8" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Fixia Inc. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Hecho con{" "}
                        <Heart className="h-3 w-3 text-red-500 fill-red-500" /> en Argentina
                    </p>
                </div>
            </div>
        </footer>
    )
}

// Helper Component para secciones
function FooterSection({
    title,
    items,
}: {
    title: string
    items: Array<{ label: string; href: string }>
}) {
    const [open, setOpen] = useState(true)

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="md:open">
            <CollapsibleTrigger className="w-full md:w-auto md:pointer-events-none md:opacity-100 flex items-center justify-between md:justify-start gap-2 font-bold text-base mb-4 hover:text-primary transition-colors">
                {title}
                <ChevronDown className="h-4 w-4 md:hidden" />
            </CollapsibleTrigger>
            <CollapsibleContent className="md:block">
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    )
}
```

**Cambios principales**:
- ✅ Usa `bg-background` (soporte dark mode automático)
- ✅ Agrupa newsletter al inicio
- ✅ Collapsible sections en mobile
- ✅ Separadores visuales con `<Separator>`
- ✅ Mejor spacing y organización
- ✅ Links de redes sociales mejorados

---

## 3. Navbar con Cmd+K Search 🔍

### Cambios en `/src/components/layout/navbar.tsx`

**Instalar componente faltante**:
```bash
npx shadcn-ui@latest add command
```

**Reemplazar la sección de búsqueda** (línea 78-85):

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
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
        ],
    },
    {
        category: "Páginas",
        items: [
            { id: "4", name: "Profesionales", href: "/professionals" },
            { id: "5", name: "Sobre Nosotros", href: "/about" },
            { id: "6", name: "Contacto", href: "/contact" },
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
                    <div className="flex items-center gap-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link href="/" className="text-lg font-semibold">
                                        Inicio
                                    </Link>
                                    <Link href="/services" className="text-lg font-semibold">
                                        Servicios
                                    </Link>
                                    <Link href="/professionals" className="text-lg font-semibold">
                                        Profesionales
                                    </Link>
                                    <Link href="/about" className="text-lg font-semibold">
                                        Sobre Nosotros
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tighter text-primary">FIXIA</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Servicios
                            </Link>
                            <Link href="/professionals" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Profesionales
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Button con Cmd+K */}
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

                        {/* Notifications with Badge */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {notificationCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                                    variant="destructive"
                                >
                                    {notificationCount}
                                </Badge>
                            )}
                            <span className="sr-only">Notificaciones</span>
                        </Button>

                        <ThemeToggle />

                        {/* User Menu */}
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
                        </DropdownMenu>
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
                                        // Reemplazar con router.push
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
```

**Cambios principales**:
- ✅ Cmd+K (⌘K) keyboard shortcut para abrir búsqueda
- ✅ CommandDialog para búsqueda moderna
- ✅ Badge con contador de notificaciones
- ✅ Mejor visual de search button
- ✅ Búsqueda dinámica (reemplazar SEARCH_DATA con datos reales)

---

## 4. Instalar Tooltips (requerido para mejoras)

**Si aún no tienes Tooltip instalado**:
```bash
npx shadcn-ui@latest add tooltip
```

Luego envuelve tu Navbar en:
```tsx
import { TooltipProvider } from "@/components/ui/tooltip"

// En tu layout.tsx o app.tsx
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            {/* resto del layout */}
        </TooltipProvider>
    )
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN FASE 1

- [ ] Instalar `command` y `tooltip` si no existen
- [ ] Reemplazar ServiceCard con StarRating mejorado
- [ ] Reemplazar Footer con nueva versión modernizada
- [ ] Reemplazar Navbar con Cmd+K search
- [ ] Probar en mobile y dark mode
- [ ] Verificar que no hay errores en console
- [ ] Hacer commit de cambios

**Comando para probar**:
```bash
npm run dev
# Luego:
# 1. Click en search bar o presiona Cmd+K (Mac) / Ctrl+K (Windows)
# 2. Hover sobre ratings en cards
# 3. Expandir/colapsar footer en mobile
```

---

## 🎯 PRÓXIMAS FASES (cuando termines FASE 1)

Una vez hayas implementado estos cambios, la FASE 2 incluye:
- Reemplazar testimonios por Carousel
- Agregar DataTable en dashboard
- Mejorar validación en formularios
- Instalar más componentes avanzados

¡Avísame cuando termines FASE 1 y pasamos a FASE 2! 🚀
