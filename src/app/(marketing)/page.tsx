"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import { Search, MapPin, Star, Shield, Clock, ArrowRight, CheckCircle2, Quote, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { TiltCard } from "@/components/ui/tilt-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ImmersiveHero } from "@/components/marketing/immersive-hero"
import { SectorShowcase } from "@/components/marketing/sector-showcase"
import { VisualProcess } from "@/components/marketing/visual-process"


export default function Home() {
    const router = useRouter();
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    const [stats, setStats] = useState([
        { value: "0", label: "Trabajos Realizados" },
        { value: "0.0", label: "Calificación Promedio" },
        { value: "0", label: "Profesionales Activos" },
        { value: "0%", label: "Clientes Felices" },
    ])
    const [categories, setCategories] = useState<any[]>([])
    const [testimonials, setTestimonials] = useState<any[]>([])

    useEffect(() => {
        // Fetch Stats
        fetch("/api/public/stats")
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setStats([
                        { value: data.jobs, label: "Trabajos Realizados" },
                        { value: data.rating, label: "Calificación Promedio" },
                        { value: data.pros, label: "Profesionales Activos" },
                        { value: data.happiness, label: "Clientes Felices" },
                    ])
                }
            })
            .catch(err => console.error("Failed to fetch stats", err))

        // Fetch Categories
        fetch("/api/public/categories")
            .then(res => res.json())
            .then(data => {
                const categoryList = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : [])
                setCategories(categoryList)
            })
            .catch(err => {
                console.error("Failed to fetch categories", err)
                setCategories([])
            })

        // Fetch Testimonials
        fetch("/api/public/testimonials")
            .then(res => res.json())
            .then(data => {
                const testimonialList = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : [])
                setTestimonials(testimonialList)
            })
            .catch(err => {
                console.error("Failed to fetch testimonials", err)
                setTestimonials([])
            })
    }, [])

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-background">
            <ImmersiveHero />

            <SectorShowcase />

            <VisualProcess />

            {/* Services Categories Section */}
            <section className="py-10 sm:py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 sm:opacity-20 pointer-events-none">
                    <div className="absolute top-10 left-5 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#788c5d]/10 dark:bg-[#788c5d]/20 rounded-full blur-2xl sm:blur-3xl" />
                    <div className="absolute bottom-10 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#d97757]/10 dark:bg-[#d97757]/20 rounded-full blur-2xl sm:blur-3xl" />
                </div>
                <div className="container px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-3 text-foreground">
                            Servicios Populares
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2">
                            Los profesionales más solicitados de tu zona
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {categories.length > 0 ? categories.map((category, index) => {
                            const colors = [
                                { accent: "#d97757", bg: "bg-[#d97757]/10 dark:bg-[#d97757]/20" },
                                { accent: "#6a9bcc", bg: "bg-[#6a9bcc]/10 dark:bg-[#6a9bcc]/20" },
                                { accent: "#788c5d", bg: "bg-[#788c5d]/10 dark:bg-[#788c5d]/20" },
                                { accent: "#d97757", bg: "bg-[#d97757]/10 dark:bg-[#d97757]/20" }
                            ];
                            const color = colors[index % colors.length];
                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <TiltCard
                                        className="group relative h-40 sm:h-56 lg:h-64 rounded-lg sm:rounded-2xl bg-gradient-to-br from-white to-muted/30 dark:from-card dark:to-muted/20 p-3 sm:p-7 shadow-sm sm:shadow-md border border-border/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                        onClick={() => router.push(`/services/${category.id}`)}
                                        style={{
                                            borderColor: `${color.accent}40`,
                                        }}
                                    >
                                        {/* Subtle background accent */}
                                        <div className={`absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 ${color.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl sm:blur-2xl`} />

                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            <motion.div
                                                className="text-2xl sm:text-5xl mb-1 sm:mb-3 flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl w-fit"
                                                style={{
                                                    backgroundColor: `${color.accent}20`,
                                                    color: color.accent
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {category.icon}
                                            </motion.div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm sm:text-xl font-bold mb-0.5 sm:mb-1 text-foreground truncate">{category.name}</h3>
                                                <p className="text-muted-foreground font-medium text-xs">{category.count} Prof.</p>
                                            </div>
                                            <motion.div
                                                className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg ${color.bg} flex items-center justify-center group-hover:scale-110 transition-all duration-300 mt-auto flex-shrink-0 group-hover:shadow-lg`}
                                                style={{
                                                    color: color.accent
                                                }}
                                                whileHover={{ scale: 1.1, rotate: 45 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <ArrowRight className="h-3 sm:h-5 w-3 sm:w-5" />
                                            </motion.div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            );
                        }) : (
                            <div className="col-span-2 sm:col-span-2 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-40 sm:h-56 lg:h-64 rounded-lg sm:rounded-2xl" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-20 sm:py-24 lg:py-28 bg-background overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="container px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Lo que dicen nuestros clientes</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Miles de usuarios han encontrado el profesional perfecto a través de Fixia</p>
                    </motion.div>
                    {testimonials.length > 0 ? (
                        <TestimonialsCarousel testimonials={testimonials} />
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-64 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 p-6 animate-pulse"
                                    >
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <div key={j} className="h-4 w-4 rounded-full bg-muted" />
                                            ))}
                                        </div>
                                        <div className="space-y-3 mb-6 flex-1">
                                            <div className="h-4 bg-muted rounded w-full" />
                                            <div className="h-4 bg-muted rounded w-5/6" />
                                        </div>
                                        <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                                            <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 bg-muted rounded w-24" />
                                                <div className="h-2 bg-muted rounded w-16" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-muted-foreground text-sm">Cargando testimonios...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Animated Stats Section */}
            <section className="py-10 sm:py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#d97757]/5 via-[#6a9bcc]/5 to-[#788c5d]/5 dark:from-[#d97757]/10 dark:via-[#6a9bcc]/10 dark:to-[#788c5d]/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d97757]/0 via-[#6a9bcc]/5 to-[#788c5d]/0 dark:via-[#6a9bcc]/10 pointer-events-none" />
                <div className="container px-4 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 text-center">
                        {stats[0].value !== "0" ? stats.map((stat, index) => {
                            const accentColors = ["#d97757", "#6a9bcc", "#788c5d", "#d97757"];
                            const color = accentColors[index % accentColors.length];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-border/30 hover:shadow-lg transition-all duration-300"
                                        style={{
                                            borderColor: `${color}40`,
                                            boxShadow: `0 0 0 0 ${color}00`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 10px 30px ${color}20`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`;
                                        }}
                                    >
                                        <div className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-3" style={{ color: color }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base group-hover:text-foreground transition-colors">{stat.label}</div>
                                    </motion.div>
                                </motion.div>
                            );
                        }) : (
                            <div className="col-span-2 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 w-full">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-20 sm:h-32 rounded-lg sm:rounded-2xl" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Immersive CTA */}
            <section className="py-10 sm:py-24 lg:py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#d97757]/10 via-[#6a9bcc]/5 to-[#788c5d]/10 dark:from-[#d97757]/15 dark:via-[#6a9bcc]/10 dark:to-[#788c5d]/15 pointer-events-none" />
                <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 -right-24 sm:-right-32 w-48 sm:w-96 h-48 sm:h-96 bg-[#d97757]/20 dark:bg-[#d97757]/30 rounded-full blur-2xl sm:blur-3xl" />
                    <div className="absolute bottom-1/4 -left-24 sm:-left-32 w-48 sm:w-96 h-48 sm:h-96 bg-[#6a9bcc]/20 dark:bg-[#6a9bcc]/30 rounded-full blur-2xl sm:blur-3xl" />
                </div>
                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        viewport={{ once: true }}
                        className="relative inline-block w-full max-w-4xl group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d97757]/20 via-[#6a9bcc]/20 to-[#788c5d]/20 rounded-xl sm:rounded-3xl blur-lg sm:blur-xl opacity-60 sm:opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-gradient-to-b from-white/90 to-muted/50 dark:from-card/90 dark:to-card/60 rounded-xl sm:rounded-3xl p-5 sm:p-12 md:p-16 lg:p-20 shadow-xl sm:shadow-2xl backdrop-blur-xl border border-[#d97757]/30 group-hover:border-[#d97757]/50 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97757]/5 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6a9bcc]/5 rounded-full blur-3xl" />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 tracking-tight leading-tight">
                                    <span className="text-foreground block">Soluciones expertas</span>
                                    <span className="bg-gradient-to-r from-[#d97757] via-[#6a9bcc] to-[#788c5d] bg-clip-text text-transparent block">para cualquier necesidad</span>
                                </h2>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-xs sm:text-lg md:text-xl text-foreground font-medium mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed relative z-10 px-2"
                            >
                                Conecta con profesionales calificados para llevar a cabo tus proyectos con total confianza y seguridad.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center flex-wrap relative z-10"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/become-a-pro">
                                        <Button size="sm" className="w-full sm:w-auto h-10 sm:h-13 lg:h-14 px-4 sm:px-8 lg:px-10 rounded-lg sm:rounded-full text-xs sm:text-base lg:text-lg bg-gradient-to-r from-[#d97757] to-[#d97757]/90 text-white shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl hover:shadow-[#d97757]/40 hover:scale-105 transition-all font-semibold">
                                            Comenzar Ahora
                                        </Button>
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/services">
                                        <Button size="sm" variant="outline" className="w-full sm:w-auto h-10 sm:h-13 lg:h-14 px-4 sm:px-8 lg:px-10 rounded-lg sm:rounded-full text-xs sm:text-base lg:text-lg border-2 border-[#6a9bcc] text-[#6a9bcc] hover:bg-[#6a9bcc]/10 hover:shadow-md sm:hover:shadow-lg hover:shadow-[#6a9bcc]/20 font-semibold transition-all">
                                            Ver Servicios
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section >
        </div >
    )
}
