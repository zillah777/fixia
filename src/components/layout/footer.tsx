"use client"

import Link from "next/link"
import Image from "next/image"
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

// Imports needed
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PWAInstallGuide } from "@/components/pwa/pwa-install-guide"

export function Footer() {
    const [openSections, setOpenSections] = useState({
        company: true,
        services: true,
        legal: true,
    })
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (!res.ok) throw new Error("Error al suscribirse")

            toast.success("¡Gracias por suscribirte!")
            setEmail("")
        } catch (error) {
            toast.error("Hubo un error, intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

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
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="flex-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button size="sm" className="px-6" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suscribirse"}
                        </Button>
                    </form>
                </div>

                {/* PWA Install Banner */}
                <div className="mb-16 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold tracking-tight">Instalar Fixia</h3>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Sigue estos pasos para agregar Fixia a tu pantalla de inicio y usarla como una app nativa.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <PWAInstallGuide trigger={
                            <Button className="rounded-full font-semibold shadow-lg hover:shadow-primary/25 transition-all">
                                Ver Instrucciones
                            </Button>
                        } />
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {/* Logo Section */}
                    <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Fixia Logo"
                                width={240}
                                height={80}
                                className="h-16 w-auto object-contain"
                            />
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
                            { label: "Blog", href: "/blog" },
                        ]}
                    >
                        <div className="md:hidden mt-3">
                            <PWAInstallGuide trigger={
                                <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Instalar App
                                </Button>
                            } />
                        </div>
                    </FooterSection>

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
                        <Heart className="h-3 w-3 text-destructive fill-red-500" /> en Argentina
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
    children
}: {
    title: string
    items: Array<{ label: string; href: string }>
    children?: React.ReactNode
}) {
    const [open, setOpen] = useState(true)

    return (
        <Collapsible open={open} onOpenChange={setOpen} defaultOpen>
            <CollapsibleTrigger className="w-full md:w-auto md:pointer-events-none md:opacity-100 flex items-center justify-between md:justify-start gap-2 font-bold text-base mb-4 hover:text-primary transition-colors">
                {title}
                <ChevronDown className="h-4 w-4 md:hidden" />
            </CollapsibleTrigger>
            <CollapsibleContent className="block">
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
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
