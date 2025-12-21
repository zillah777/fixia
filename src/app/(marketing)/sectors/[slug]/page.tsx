"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Home, Building2, Briefcase, Zap, Shield, Star } from "lucide-react"

const content: Record<string, any> = {
    hogares: {
        title: "Soluciones para tu Hogar",
        subtitle: "Cuidamos tu lugar en el mundo como si fuera nuestro.",
        image: "/assets/marketing/home-service.png",
        icon: <Home className="h-12 w-12" />,
        color: "#d97757",
        services: ["Plomería 24hs", "Electricidad", "Limpieza Profunda", "Mantenimiento AC", "Pintura y Refacción"],
        benefits: [
            "Profesionales verificados con antecedentes",
            "Garantía Fixia en todos los trabajos",
            "Precios claros y sin sorpresas"
        ]
    },
    oficinas: {
        title: "Soporte para Oficinas",
        subtitle: "Mantén tu espacio de trabajo funcionando al 100%.",
        image: "/assets/marketing/office-service.png",
        icon: <Briefcase className="h-12 w-12" />,
        color: "#6a9bcc",
        services: ["Soporte Técnico IT", "Networking y WiFi", "Limpieza de Oficinas", "Mantenimiento Preventivo", "Ergonomía y Montaje"],
        benefits: [
            "Atención prioritaria para empresas",
            "Facturación corporativa simplificada",
            "Planes de mantenimiento mensual"
        ]
    },
    empresas: {
        title: "Servicios para Empresas",
        subtitle: "Infraestructura y soluciones a gran escala.",
        image: "/assets/marketing/commercial-service.png",
        icon: <Building2 className="h-12 w-12" />,
        color: "#788c5d",
        services: ["Logística y Distribución", "Seguridad Técnica", "Instalaciones Industriales", "Gestión de Residuos", "Catering Corporativo"],
        benefits: [
            "Gestores de cuenta dedicados",
            "SLA garantizado de respuesta",
            "Red nacional de proveedores"
        ]
    }
}

export default function SectorPage() {
    const params = useParams()
    if (!params) return null

    const slug = params.slug as string
    const data = content[slug]

    if (!data) return <div>Sector no encontrado</div>

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                <div className="container relative z-10 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-white shadow-2xl" style={{ backgroundColor: data.color }}>
                            {data.icon}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                            {data.title}
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-background">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                    <Zap className="h-8 w-8 text-[#d97757]" /> Servicios Incluidos
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.services.map((service: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                                            <CheckCircle2 className="h-5 w-5" style={{ color: data.color }} />
                                            <span className="font-semibold">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] border border-border bg-card shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <Shield className="h-7 w-7 text-emerald-500" /> ¿Por qué elegir Fixia {data.title}?
                                </h2>
                                <ul className="space-y-4">
                                    {data.benefits.map((benefit: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Star className="h-5 w-5 mt-1 text-amber-500 fill-amber-500" />
                                            <span className="text-muted-foreground">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="sticky top-24 p-8 rounded-[2rem] bg-gradient-to-br from-[#d97757]/10 to-transparent border border-[#d97757]/20">
                                <h3 className="text-3xl font-black uppercase tracking-tight mb-6">¿Listo para empezar?</h3>
                                <p className="text-muted-foreground mb-8">
                                    Dinos qué necesitas y te conectaremos con los mejores profesionales calificados en Argentina.
                                </p>
                                <div className="space-y-4">
                                    <Link href="/services" className="block">
                                        <Button className="w-full h-14 text-lg font-bold bg-[#d97757] hover:bg-[#d97757]/90 text-white rounded-2xl">
                                            Solicitar Presupuesto Gratis
                                        </Button>
                                    </Link>
                                    <Link href="/become-a-pro" className="block text-center">
                                        <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground">
                                            Quiero ser un profesional proveedor
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
