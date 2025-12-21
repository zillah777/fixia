"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Search,
    MessageSquare,
    Star,
    UserCheck,
    CheckCircle2,
    ArrowRight,
    Shield,
    Zap,
    Heart,
    Briefcase,
    FileText,
    Sparkles,
    ShieldCheck,
    Coins
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#faf9f5] dark:bg-[#141413] font-sans selection:bg-[#d97757] selection:text-white">
            {/* Hero Section - Immersive */}
            <section className="relative py-24 lg:py-40 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d97757]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6a9bcc]/5 rounded-full blur-[100px]" />
                </div>

                <div className="container px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97757]/10 text-[#d97757] text-xs font-bold tracking-widest uppercase mb-8 border border-[#d97757]/20">
                            <Sparkles className="h-3 w-3" />
                            <span>La Nueva Era de Servicios</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-[#141413] dark:text-[#faf9f5] leading-[1.1]">
                            Conectamos talento con <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] via-[#6a9bcc] to-[#788c5d]">
                                soluciones reales.
                            </span>
                        </h1>
                        <p className="text-xl text-[#b0aea5] dark:text-[#b0aea5] leading-relaxed max-w-2xl mx-auto mb-10">
                            Fixia es el ecosistema donde la confianza y la eficiencia se encuentran. Diseñado para simplificar cada paso de tu proyecto.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard/requests/create">
                                <Button size="lg" className="rounded-full px-10 h-14 text-base bg-[#d97757] hover:bg-[#d97757]/90 text-white shadow-lg shadow-[#d97757]/20 hover:shadow-xl transition-all duration-300">
                                    Publicar Proyecto <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/become-a-pro">
                                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base border-[#e8e6dc] text-[#141413] dark:text-[#faf9f5] hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300">
                                    Ser Profesional
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Experience Flow - Editorial Style */}
            <section className="py-24 bg-white/40 dark:bg-[#141413]/40 backdrop-blur-sm border-y border-[#e8e6dc] dark:border-[#e8e6dc]/10">
                <div className="container px-4">
                    {/* For Clients Header */}
                    <div className="max-w-6xl mx-auto mb-20 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-4 justify-center md:justify-start"
                        >
                            <div className="h-10 w-1 bg-[#d97757] rounded-full"></div>
                            <h2 className="text-3xl font-bold text-[#141413] dark:text-[#faf9f5]">Para Clientes</h2>
                        </motion.div>
                        <p className="text-[#b0aea5] max-w-xl">Desde la idea hasta el resultado final, te acompañamos en cada decisión.</p>
                    </div>

                    {/* CLIENT STEPS */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-32"
                    >
                        {[
                            {
                                icon: FileText,
                                title: "Publica",
                                desc: "Describe lo que necesitas. Nuestra IA ayuda a que los mejores lo entiendan rápido.",
                                accent: "#d97757"
                            },
                            {
                                icon: UserCheck,
                                title: "Elige",
                                desc: "Revisa perfiles, fotos de trabajos anteriores y reputación verificada por la comunidad.",
                                accent: "#6a9bcc"
                            },
                            {
                                icon: MessageSquare,
                                title: "Coordina",
                                desc: "Chatea directo con el profesional. Sin esperas y sin intermediarios molestos.",
                                accent: "#788c5d"
                            },
                            {
                                icon: Star,
                                title: "Califica",
                                desc: "Tu feedback es oro. Ayuda a que los mejores profesionales sigan creciendo.",
                                accent: "#d97757"
                            }
                        ].map((step, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="group h-full border-none shadow-none bg-transparent hover:bg-white dark:hover:bg-white/5 transition-all duration-500 rounded-3xl p-6">
                                    <div className="mb-8 relative">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 overflow-hidden"
                                            style={{ backgroundColor: `${step.accent}15`, color: step.accent }}>
                                            <step.icon className="h-8 w-8" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                        </div>
                                        <span className="absolute -top-4 -right-2 text-7xl font-black text-[#e8e6dc]/30 dark:text-[#e8e6dc]/5 select-none transition-transform group-hover:scale-110">
                                            0{i + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-[#141413] dark:text-[#faf9f5] group-hover:translate-x-1 transition-transform">{step.title}</h3>
                                    <p className="text-[#b0aea5] leading-relaxed text-sm">
                                        {step.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* For Professionals Header */}
                    <div className="max-w-6xl mx-auto mb-20 text-center md:text-right flex flex-col items-center md:items-end">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-4"
                        >
                            <h2 className="text-3xl font-bold text-[#141413] dark:text-[#faf9f5]">Para Profesionales</h2>
                            <div className="h-10 w-1 bg-[#788c5d] rounded-full"></div>
                        </motion.div>
                        <p className="text-[#b0aea5] max-w-xl md:text-right text-center">Transforma tu conocimiento en un negocio escalable con reputación garantizada.</p>
                    </div>

                    {/* PRO STEPS */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                    >
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Verifícate",
                                desc: "Un perfil verificado genera 3x más confianza. Sube tus credenciales y destaca.",
                                accent: "#788c5d"
                            },
                            {
                                icon: Zap,
                                title: "Postula",
                                desc: "Recibes notificaciones de trabajos que encajan con tu perfil. Elige cuáles tomar.",
                                accent: "#d97757"
                            },
                            {
                                icon: Coins,
                                title: "Gana Todo",
                                desc: "No cobramos comisión por trabajo finalizado. Tu esfuerzo es 100% para ti.",
                                accent: "#6a9bcc"
                            },
                            {
                                icon: Heart,
                                title: "Fideliza",
                                desc: "Construye una base de clientes recurrentes gracias a tu excelente servicio.",
                                accent: "#788c5d"
                            }
                        ].map((step, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="group h-full border-none shadow-none bg-transparent hover:bg-white dark:hover:bg-white/5 transition-all duration-500 rounded-3xl p-6">
                                    <div className="mb-8 relative">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 overflow-hidden"
                                            style={{ backgroundColor: `${step.accent}15`, color: step.accent }}>
                                            <step.icon className="h-8 w-8" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                        </div>
                                        <span className="absolute -top-4 -right-2 text-7xl font-black text-[#e8e6dc]/30 dark:text-[#e8e6dc]/5 select-none transition-transform group-hover:scale-110">
                                            0{i + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-[#141413] dark:text-[#faf9f5] group-hover:translate-x-1 transition-transform">{step.title}</h3>
                                    <p className="text-[#b0aea5] leading-relaxed text-sm">
                                        {step.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Why Fixia - Premium Trust Section */}
            <section className="py-32 relative">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold mb-6 text-[#141413] dark:text-[#faf9f5]">El Compromiso Fixia</h2>
                        <p className="text-[#b0aea5]">Diseñamos tecnología para proteger lo más valioso: tu tranquilidad.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Shield,
                                title: "Seguridad 360°",
                                desc: "Desde el login hasta el pago final, protegemos tus datos y tu integridad transaccional.",
                                accent: "#d97757"
                            },
                            {
                                icon: CheckCircle2,
                                title: "Transparencia",
                                desc: "Sin letras chicas. Los acuerdos son claros y los perfiles son auditados constantemente.",
                                accent: "#6a9bcc"
                            },
                            {
                                icon: Star,
                                title: "Comunidad Elite",
                                desc: "No cualquiera entra. Filtramos y premiamos solo a quienes comparten nuestros valores.",
                                accent: "#788c5d"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative p-8 rounded-[40px] bg-[#e8e6dc]/30 dark:bg-white/5 border border-[#e8e6dc]/50 dark:border-white/10 group overflow-hidden"
                            >
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.03] group-hover:scale-150 transition-transform duration-700" style={{ color: feature.accent }} />
                                <div className="h-16 w-16 bg-white dark:bg-[#141413] shadow-xl shadow-stone-200/50 dark:shadow-none rounded-2xl flex items-center justify-center mb-8 relative z-10" style={{ color: feature.accent }}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-[#141413] dark:text-[#faf9f5]">{feature.title}</h3>
                                <p className="text-[#b0aea5] text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 container px-4">
                <div className="bg-[#141413] dark:bg-white rounded-[50px] p-12 md:p-24 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#d97757]/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6a9bcc]/10 rounded-full blur-[100px] -ml-20 -mb-20 group-hover:scale-110 transition-transform duration-1000" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-[#faf9f5] dark:text-[#141413]">¿Listo para empezar?</h2>
                        <p className="text-[#b0aea5] dark:text-[#b0aea5] mb-12 text-lg">Únete a miles de personas que ya están transformando su forma de trabajar y contratar.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/dashboard/requests/create">
                                <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-[#d97757] hover:bg-[#d97757]/90 text-white border-0">
                                    Soy Cliente
                                </Button>
                            </Link>
                            <Link href="/become-a-pro">
                                <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg border-white/20 text-white dark:border-[#141413]/20 dark:text-[#141413] hover:bg-white hover:text-[#141413] dark:hover:bg-[#141413] dark:hover:text-white transition-all">
                                    Soy Profesional
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
