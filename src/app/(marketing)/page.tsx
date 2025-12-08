"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import { Search, MapPin, Star, Shield, Clock, ArrowRight, CheckCircle2, Quote, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { MarketplaceShowcase } from "@/components/marketplace-showcase"

// 3D Tilt Card Component
function TiltCard({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }

    return (
        <motion.div
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
            style={{
                transformStyle: "preserve-3d",
                rotateX: useTransform(mouseY, [-300, 300], [10, -10]),
                rotateY: useTransform(mouseX, [-300, 300], [-10, 10]),
            }}
        >
            {children}
        </motion.div>
    );
}

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
                if (Array.isArray(data)) setCategories(data)
            })
            .catch(err => console.error("Failed to fetch categories", err))

        // Fetch Testimonials
        fetch("/api/public/testimonials")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTestimonials(data)
            })
            .catch(err => console.error("Failed to fetch testimonials", err))
    }, [])

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-background">
            {/* Hero Section with Spotlight Effect */}
            <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-70 dark:from-primary/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 dark:bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="container px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mx-auto max-w-4xl space-y-8"
                    >
                        <Badge variant="outline" className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm animate-pulse border-accent/30 bg-accent/10 text-accent font-medium text-xs sm:text-sm">
                            ✨ La forma más inteligente de contratar
                        </Badge>

                        {/* OPCIÓN 4: Outline Text + Shadow Depth (ACTIVA) */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-2 sm:mb-3 font-medium">
                                Tu hogar,
                            </span>
                            <span className="block text-foreground mb-3 sm:mb-4">
                                en buenas manos.
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative inline-block"
                                style={{
                                    WebkitTextStroke: '2px transparent',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #10b981 50%, #d4a574 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(2px 2px 0px rgba(13, 148, 136, 0.3)) drop-shadow(4px 4px 0px rgba(16, 185, 129, 0.15))',
                                }}
                            >
                                Fixia
                            </motion.span>
                        </motion.h1>

                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                            Conectamos tus necesidades con los mejores profesionales de tu zona.
                            Sin esperas, sin complicaciones, con garantía total.
                        </p>

                        {/* Floating Search Bar - Fully Responsive */}
                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(13, 148, 136, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            className="mx-auto w-full max-w-2xl p-1 sm:p-1.5 bg-white dark:bg-card rounded-2xl shadow-lg shadow-primary/10 dark:shadow-primary/20 border border-border/50 backdrop-blur-sm flex items-center gap-1 sm:gap-2 transition-all duration-300"
                        >
                            <div className="pl-3 sm:pl-4 text-muted-foreground flex-shrink-0">
                                <motion.div
                                    whileHover={{ scale: 1.1, color: "hsl(152 71% 40%)" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.div>
                            </div>
                            <Input
                                className="border-none shadow-none bg-transparent h-10 sm:h-12 text-sm sm:text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 flex-1"
                                placeholder="¿Qué necesitas arreglar?"
                            />
                            <Button size="sm" className="rounded-xl px-3 sm:px-6 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg transition-all whitespace-nowrap font-semibold flex-shrink-0 h-9 sm:h-10">
                                Buscar
                            </Button>
                        </motion.div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {["Profesionales Verificados", "Garantía de Calidad", "100% Confiable"].map((text, i) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                    <span className="whitespace-nowrap">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Categories Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative">
                <div className="container px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-3 text-foreground">
                            Servicios Populares
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                            Los profesionales más solicitados de tu zona
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {categories.length > 0 ? categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <TiltCard
                                    className="group relative h-48 sm:h-56 lg:h-64 rounded-2xl bg-gradient-to-br from-white to-muted/30 dark:from-card dark:to-muted/20 p-6 sm:p-7 shadow-md shadow-primary/5 dark:shadow-primary/10 border border-border/40 backdrop-blur-sm hover:shadow-warm hover:border-border/80 active:shadow-warm transition-all duration-300 cursor-pointer overflow-hidden"
                                    onClick={() => router.push(`/services/${category.id}`)}
                                >
                                    {/* Subtle background accent */}
                                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-full blur-2xl`} />

                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <motion.div
                                            className="text-4xl sm:text-5xl mb-3 flex-shrink-0"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {category.icon}
                                        </motion.div>
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-bold mb-1 text-foreground">{category.name}</h3>
                                            <p className="text-muted-foreground font-medium text-xs sm:text-sm">{category.count} Profesionales</p>
                                        </div>
                                        <motion.div
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 mt-auto flex-shrink-0"
                                            whileHover={{ scale: 1.1, rotate: 45 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </motion.div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        )) : (
                            <div className="col-span-4 text-center text-muted-foreground">Cargando categorías...</div>
                        )}
                    </div>
                </div>
            </section>

            {/* Marketplace Showcase - Beautiful Elements */}
            <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-background via-accent/2 to-background relative overflow-hidden">
                <div className="container px-4 relative z-10">
                    <MarketplaceShowcase />
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
                        <div className="text-center text-muted-foreground">Aún no hay reseñas destacadas.</div>
                    )}
                </div>
            </section>

            {/* Animated Stats Section */}
            <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-accent/5 to-primary/0 dark:via-accent/10 pointer-events-none" />
                <div className="container px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 text-center">
                        {stats.map((stat, index) => (
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
                                    className="p-4 sm:p-6 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all duration-300"
                                >
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-gradient-primary">
                                        {stat.value}
                                    </div>
                                    <div className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base group-hover:text-foreground transition-colors">{stat.label}</div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive CTA */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 dark:via-primary/10 to-transparent pointer-events-none" />
                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        viewport={{ once: true }}
                        className="bg-aurora p-[2px] rounded-3xl inline-block w-full max-w-4xl"
                    >
                        <div className="bg-gradient-to-b from-white/80 to-muted/40 dark:from-card/80 dark:to-card/40 rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 shadow-lg shadow-primary/10 dark:shadow-primary/20 backdrop-blur-xl border border-border/40">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-foreground leading-tight">
                                    ¿Listo para transformar tu hogar?
                                </h2>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
                            >
                                Únete a miles de usuarios que ya disfrutan de un servicio de calidad, rápido y seguro.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center flex-wrap"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="w-full xs:w-auto"
                                >
                                    <Button size="lg" className="w-full xs:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-full text-sm sm:text-base lg:text-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold">
                                        Comenzar Ahora
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="w-full xs:w-auto"
                                >
                                    <Button size="lg" variant="outline" className="w-full xs:w-auto h-12 sm:h-13 lg:h-14 px-6 sm:px-8 lg:px-10 rounded-xl sm:rounded-full text-sm sm:text-base lg:text-lg border-2 hover:bg-muted/80 font-semibold transition-all">
                                        Ver Servicios
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
