"use client"

import React from "react"
import { motion } from "framer-motion"
import { Search, MessageSquare, Star, UserCheck, CheckCircle2, ArrowRight, Shield, Zap, Heart, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] dark:bg-background overflow-hidden font-sans">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32">
                <div className="container px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center max-w-3xl mx-auto mb-24"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-stone-900 dark:text-foreground">
                            Simplificamos la contratación <br /> de servicios expertos.
                        </h1>
                        <p className="text-xl text-stone-600 dark:text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Una plataforma diseñada para conectar necesidades reales con soluciones profesionales.
                            Sin fricción, sin comisiones ocultas, con total transparencia.
                        </p>
                    </motion.div>

                    {/* For Clients */}
                    <div className="mb-32 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-12 pl-2"
                        >
                            <div className="h-8 w-1 bg-stone-900 dark:bg-primary rounded-full"></div>
                            <div>
                                <h2 className="text-2xl font-semibold text-stone-900 dark:text-foreground">Para Clientes</h2>
                                <p className="text-stone-500 dark:text-muted-foreground">Resuelve tus proyectos con seguridad</p>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: FileText,
                                    title: "Publica tu Proyecto",
                                    desc: "Detalla tu necesidad con precisión. Recibe atención inmediata de expertos interesados.",
                                    color: "text-stone-700 dark:text-primary"
                                },
                                {
                                    icon: UserCheck,
                                    title: "Elige con Confianza",
                                    desc: "Evalúa perfiles verificados, credenciales y reseñas auténticas antes de tomar una decisión.",
                                    color: "text-stone-700 dark:text-primary"
                                },
                                {
                                    icon: MessageSquare,
                                    title: "Conecta Directo",
                                    desc: "Sin intermediarios. Acuerda los términos y coordina el trabajo directamente con el profesional.",
                                    color: "text-stone-700 dark:text-primary"
                                },
                                {
                                    icon: Star,
                                    title: "Valida la Calidad",
                                    desc: "Tu opinión construye confianza. Califica el servicio para mantener la excelencia de la red.",
                                    color: "text-stone-700 dark:text-primary"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full border border-stone-200 dark:border-border shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-card/50">
                                        <CardContent className="pt-8 px-6 pb-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-3 bg-stone-100 dark:bg-primary/10 rounded-xl ${step.color}`}>
                                                    <step.icon className="h-6 w-6" />
                                                </div>
                                                <span className="text-4xl font-bold text-stone-100 dark:text-muted/10 select-none">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-foreground">{step.title}</h3>
                                            <p className="text-stone-600 dark:text-muted-foreground text-sm leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/dashboard/requests/create">
                                <Button size="lg" className="rounded-full px-8 h-12 text-base bg-stone-900 hover:bg-stone-800 text-white dark:bg-primary dark:hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                                    Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* For Professionals */}
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-12 pl-2"
                        >
                            <div className="h-8 w-1 bg-stone-400 dark:bg-accent rounded-full"></div>
                            <div>
                                <h2 className="text-2xl font-semibold text-stone-900 dark:text-foreground">Para Profesionales</h2>
                                <p className="text-stone-500 dark:text-muted-foreground">Impulsa tu carrera independiente</p>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Shield,
                                    title: "Construye Reputación",
                                    desc: "Crea un perfil profesional sólido. Tus certificaciones y trabajos previos son tu mejor carta de presentación.",
                                    color: "text-stone-700 dark:text-accent"
                                },
                                {
                                    icon: Search,
                                    title: "Accede a Oportunidades",
                                    desc: "Visualiza solicitudes de clientes reales en tu zona. Filtra por especialidad y ubicación.",
                                    color: "text-stone-700 dark:text-accent"
                                },
                                {
                                    icon: Briefcase,
                                    title: "Propón tu Solución",
                                    desc: "Envía presupuestos competitivos y personalizados. Destaca por tu profesionalismo y claridad.",
                                    color: "text-stone-700 dark:text-accent"
                                },
                                {
                                    icon: Heart,
                                    title: "Crece con Excelencia",
                                    desc: "Brinda un servicio memorable. Los clientes satisfechos te recomendarán y volverán a contratarte.",
                                    color: "text-stone-700 dark:text-accent"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full border border-stone-200 dark:border-border shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-card/50">
                                        <CardContent className="pt-8 px-6 pb-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-3 bg-stone-100 dark:bg-accent/10 rounded-xl ${step.color}`}>
                                                    <step.icon className="h-6 w-6" />
                                                </div>
                                                <span className="text-4xl font-bold text-stone-100 dark:text-muted/10 select-none">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-foreground">{step.title}</h3>
                                            <p className="text-stone-600 dark:text-muted-foreground text-sm leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/become-a-pro">
                                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-white transition-all duration-300">
                                    Unirme como Profesional
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-stone-100 dark:bg-muted/30">
                <div className="container px-4 text-center">
                    <h2 className="text-3xl font-bold mb-16 text-stone-900 dark:text-foreground">Compromiso Fixia</h2>
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="h-14 w-14 bg-white dark:bg-card shadow-sm rounded-2xl flex items-center justify-center mb-6 text-stone-800 dark:text-foreground">
                                <Shield className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-foreground">Identidad Verificada</h3>
                            <p className="text-stone-600 dark:text-muted-foreground text-sm max-w-xs">Validamos rigurosamente la identidad de cada profesional para garantizar tu seguridad.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-14 w-14 bg-white dark:bg-card shadow-sm rounded-2xl flex items-center justify-center mb-6 text-stone-800 dark:text-foreground">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-foreground">Transparencia Total</h3>
                            <p className="text-stone-600 dark:text-muted-foreground text-sm max-w-xs">Sin comisiones ocultas ni sorpresas. El acuerdo económico es directo entre las partes.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-14 w-14 bg-white dark:bg-card shadow-sm rounded-2xl flex items-center justify-center mb-6 text-stone-800 dark:text-foreground">
                                <Star className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-stone-900 dark:text-foreground">Meritocracia Real</h3>
                            <p className="text-stone-600 dark:text-muted-foreground text-sm max-w-xs">Nuestra comunidad premia la excelencia. Las calificaciones auténticas guían tu elección.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
