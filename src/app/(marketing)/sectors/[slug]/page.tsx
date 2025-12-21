"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CheckCircle2,
    ArrowRight,
    Home,
    Building2,
    Briefcase,
    Zap,
    Shield,
    Star,
    Clock,
    MapPin,
    HardHat,
    Search,
    Wrench,
    Utensils,
    Server
} from "lucide-react"

const content: Record<string, any> = {
    hogares: {
        title: "Soluciones para tu Hogar",
        subtitle: "Cuidamos tu casa como si fuera la nuestra. Desde reparaciones urgentes hasta proyectos de renovación.",
        image: "/assets/marketing/home-service.png",
        icon: <Home className="h-12 w-12" />,
        color: "#d97757",
        heroText: "Haz de tu casa el mejor lugar para estar.",
        features: [
            { icon: <Search />, title: "Búsqueda Local", desc: "Profesionales en tu barrio, listos para salir." },
            { icon: <Shield />, title: "Seguridad", desc: "Personal con antecedentes verificados y referencias." },
            { icon: <Clock />, title: "Respuesta Rápida", desc: "Atención en emergencias de plomería y luz 24/7." }
        ],
        services: [
            "Plomería y Gas: Destapes, fugas y reparaciones.",
            "Electricidad: Instalaciones, cortocircuitos y tableros.",
            "Climatización: Service de Aire Acondicionado y estufas.",
            "Pintura y Albañilería: Renovaciones estéticas y estructurales.",
            "Limpieza Integral: Post-obra o mantenimiento semanal."
        ],
        faqs: [
            { q: "¿Tienen garantía?", a: "Sí, todos los trabajos realizados a través de Fixia cuentan con garantía de satisfacción." },
            { q: "¿Cómo pago?", a: "Coordinas el pago directamente con el profesional, aceptamos todos los medios." }
        ]
    },
    oficinas: {
        title: "Mantenimiento de Oficinas",
        subtitle: "Maximizamos la productividad de tu equipo manteniendo un entorno de trabajo impecable y funcional.",
        image: "/assets/marketing/office-service.png",
        icon: <Briefcase className="h-12 w-12" />,
        color: "#6a9bcc",
        heroText: "Productividad sin interrupciones técnicas.",
        features: [
            { icon: <Server />, title: "Soporte IT", desc: "Mantenimiento de redes, hardware y conectividad." },
            { icon: <Building2 />, title: "Facility Management", desc: "Gestión integral de las necesidades del edificio." },
            { icon: <Briefcase />, title: "Servicios Corporativos", desc: "Facturación A y planes de mantenimiento preventivo." }
        ],
        services: [
            "Mantenimiento Eléctrico y UPS: Evita caídas de sistema.",
            "Soporte de Redes y WiFi: Conectividad de alta velocidad siempre.",
            "Instalaciones de Oficina: Armado de puestos de trabajo y mobiliario.",
            "Limpieza Corporativa: Protocolos de higiene para grandes equipos.",
            "Gestión de Insumos: Mantenemos tu stock siempre completo."
        ],
        faqs: [
            { q: "¿Emiten Factura A?", a: "Sí, todos nuestros proveedores para este sector están habilitados legalmente." },
            { q: "¿Hay abonos mensuales?", a: "Contamos con planes flexibles de mantenimiento preventivo anual." }
        ]
    },
    empresas: {
        title: "Servicios Industriales y Locales",
        subtitle: "Soluciones robustas para comercios, fábricas y grandes superficies. Infraestructura que no se detiene.",
        image: "/assets/marketing/commercial-service.png",
        icon: <Building2 className="h-12 w-12" />,
        color: "#788c5d",
        heroText: "Tu aliada en la logística y el crecimiento comercial.",
        features: [
            { icon: <HardHat />, title: "Seguridad e Higiene", desc: "Cumplimiento estricto de normativas vigentes." },
            { icon: <MapPin />, title: "Cobertura Nacional", desc: "Atención a cadenas de locales en todo el país." },
            { icon: <Zap />, title: "Urgencias Comerciales", desc: "Atención inmediata para que tu local no pierda ventas." }
        ],
        services: [
            "Instalaciones a Gran Escala: Electricidad media tensión y gas industrial.",
            "Logística y Mudanza Comercial: Traslados seguros de maquinaria y stock.",
            "Seguridad Electrónica: CCTV, alarmas y controles de acceso.",
            "Gestión de Residuos Especiales: Manejo responsable y certificado.",
            "Catering y Eventos: Soluciones gastronómicas para tu empresa."
        ],
        faqs: [
            { q: "¿Tienen cobertura nacional?", a: "Sí, operamos en las principales ciudades de Argentina con red propia." },
            { q: "¿Cómo garantizan el tiempo de respuesta?", a: "Asignamos un gestor de cuenta dedicado para urgencias críticas." }
        ]
    }
}

export default function SectorPage() {
    const params = useParams()
    if (!params) return null

    const slug = params.slug as string
    const data = content[slug]

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Sector no encontrado</h1>
                <Link href="/">
                    <Button variant="link">Volver al inicio</Button>
                </Link>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background" />

                <div className="container relative z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <Badge className="bg-[#d97757] text-white hover:bg-[#d97757]/90 px-6 py-2 rounded-full text-base font-bold tracking-widest uppercase">
                            Fixia {slug}
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">
                            {data.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-24 bg-background relative -mt-20 z-20">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.features.map((feature: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-stone-100 dark:border-border shadow-xl hover:shadow-2xl transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500" style={{ backgroundColor: data.color + '20', color: data.color }}>
                                    {Object.cloneElement(feature.icon, { className: "h-8 w-8 transition-transform group-hover:scale-110" })}
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Services */}
            <section className="py-24 bg-stone-50 dark:bg-muted/5">
                <div className="container px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="flex-1 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 italic">
                                    Lo que <span className="text-[#d97757]">ofrecemos</span>
                                </h2>
                                <p className="text-xl text-muted-foreground">
                                    Nos encargamos de todo para que no tengas que preocuparte de nada. Calidad certificada en cada intervención.
                                </p>
                            </motion.div>

                            <div className="space-y-4">
                                {data.services.map((service: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-stone-200 dark:border-border shadow-sm hover:border-[#d97757]/50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-stone-100 dark:bg-muted font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <span className="text-lg font-bold">{service}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-[400px] sticky top-24">
                            <div className="p-10 rounded-[3rem] bg-black text-white space-y-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-150 duration-700">
                                    {data.icon}
                                </div>
                                <h3 className="text-3xl font-black uppercase leading-tight italic">¿Listo para la solución?</h3>
                                <p className="text-white/70 text-lg">
                                    Únete a los miles de argentinos que ya confían en Fixia para simplificar su mantenimiento.
                                </p>
                                <div className="space-y-4 relative z-10">
                                    <Link href="/services" className="block">
                                        <Button className="w-full h-16 text-lg font-bold bg-[#d97757] hover:bg-[#d97757]/90 text-white rounded-2xl shadow-lg ring-offset-black hover:ring-2 ring-[#d97757] transition-all">
                                            Empezar Ahora
                                        </Button>
                                    </Link>
                                    <p className="text-center text-xs text-white/40 font-medium">Buscás, Comparás, Solucionás.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 bg-background">
                <div className="container max-w-4xl px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black uppercase italic mb-4">Preguntas Frecuentes</h2>
                        <div className="w-20 h-1 bg-[#d97757] mx-auto" />
                    </div>
                    <div className="space-y-8">
                        {data.faqs.map((faq: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <h4 className="text-xl font-black uppercase text-[#d97757]">{faq.q}</h4>
                                <p className="text-muted-foreground text-lg leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

import React from "react"
