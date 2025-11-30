"use client"

import { useState, useRef } from "react"
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

const categories = [
    { id: "plomeria", name: "Plomería", icon: "💧", count: "120+", color: "from-blue-500/20 to-cyan-500/20" },
    { id: "electricidad", name: "Electricidad", icon: "⚡", count: "85+", color: "from-yellow-500/20 to-orange-500/20" },
    { id: "limpieza", name: "Limpieza", icon: "✨", count: "200+", color: "from-green-500/20 to-emerald-500/20" },
    { id: "jardineria", name: "Jardinería", icon: "🌿", count: "60+", color: "from-green-600/20 to-lime-500/20" },
];

const testimonials = [
    { id: "1", name: "Ana García", role: "Cliente Verificado", text: "¡Increíble servicio! Encontré un plomero en 5 minutos.", avatar: "/avatars/01.png", rating: 5 },
    { id: "2", name: "Carlos Ruiz", role: "Cliente Verificado", text: "La mejor app para solucionar problemas del hogar.", avatar: "/avatars/02.png", rating: 5 },
    { id: "3", name: "Sofia Lopez", role: "Cliente Verificado", text: "Profesionales muy amables y trabajo impecable.", avatar: "/avatars/03.png", rating: 5 },
    { id: "4", name: "Miguel Diaz", role: "Cliente Verificado", text: "Me salvó el fin de semana. Recomendadísimo.", avatar: "/avatars/04.png", rating: 5 },
];

const stats = [
    { value: "10k+", label: "Trabajos Realizados" },
    { value: "4.9/5", label: "Calificación Promedio" },
    { value: "2k+", label: "Profesionales Activos" },
    { value: "98%", label: "Clientes Felices" },
];

export default function Home() {
    const router = useRouter();
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

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
                        <Badge variant="outline" className="px-4 py-2 rounded-full backdrop-blur-sm animate-pulse border-primary/20 bg-primary/5 text-primary">
                            ✨ La forma más inteligente de contratar
                        </Badge>

                        {/* OPCIÓN 1: Aurora Gradient + Glassmorphism (COMENTADA) */}
                        {/* <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-4">
                                Tu vida, más simple.
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative inline-block group"
                            >
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(168, 139, 250, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%)',
                                    }}
                                />
                                <span
                                    className="relative z-10 text-transparent bg-clip-text px-4"
                                    style={{
                                        backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient 4s ease infinite',
                                    }}
                                >
                                    Fixia.
                                </span>
                                <motion.span
                                    className="absolute inset-0 blur-2xl opacity-30"
                                    style={{
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
                                    }}
                                    animate={{
                                        opacity: [0.2, 0.4, 0.2],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.span>
                        </motion.h1> */}

                        {/* OPCIÓN 2: Neon Glow + Double Underline (COMENTADA) */}
                        {/* <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-4">
                                Tu vida, más simple.
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative inline-block"
                            >
                                <span
                                    className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                                    style={{
                                        textShadow: '0 0 40px rgba(168, 139, 250, 0.5), 0 0 80px rgba(168, 139, 250, 0.3)',
                                    }}
                                >
                                    Fixia.
                                </span>
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                                    className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left"
                                />
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                                    className="absolute -bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left opacity-50"
                                />
                            </motion.span>
                        </motion.h1> */}

                        {/* OPCIÓN 3: Minimal Highlight Background (COMENTADA) */}
                        {/* <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-4">
                                Tu vida, más simple.
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative inline-block"
                            >
                                <span className="relative z-10 px-4 text-foreground font-black">
                                    Fixia.
                                </span>
                                <motion.span
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 origin-left -skew-x-12 -z-10"
                                />
                            </motion.span>
                        </motion.h1> */}

                        {/* OPCIÓN 4: Outline Text + Shadow Depth (ACTIVA) */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-2 sm:mb-3 font-medium">
                                Tu vida,
                            </span>
                            <span className="block text-foreground mb-3 sm:mb-4">
                                más simple.
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="relative inline-block"
                                style={{
                                    WebkitTextStroke: '2px transparent',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(3px 3px 0px rgba(96, 165, 250, 0.4)) drop-shadow(6px 6px 0px rgba(168, 139, 250, 0.2))',
                                }}
                            >
                                Fixia.
                            </motion.span>
                        </motion.h1>

                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                            Conectamos tus necesidades con los mejores profesionales de tu zona.
                            Sin esperas, sin complicaciones, con garantía total.
                        </p>

                        {/* Floating Search Bar */}
                        <motion.div
                            whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(96, 165, 250, 0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            className="mx-auto max-w-2xl p-1.5 sm:p-2 bg-card rounded-full shadow-2xl shadow-primary/5 border border-border/80 backdrop-blur-xl flex items-center gap-1 sm:gap-2 transition-all duration-300"
                        >
                            <div className="pl-3 sm:pl-4 text-muted-foreground">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.div>
                            </div>
                            <Input
                                className="border-none shadow-none bg-transparent h-10 sm:h-12 text-base sm:text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0"
                                placeholder="¿Qué necesitas arreglar?"
                            />
                            <Button size="lg" className="rounded-full px-4 sm:px-8 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl transition-all whitespace-nowrap font-semibold">
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

            {/* 3D Tilt Categories Section */}
            <section className="py-16 sm:py-20 lg:py-24 relative">
                <div className="container px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl mb-3 sm:mb-4">Servicios Populares</h2>
                        <p className="text-muted-foreground text-base sm:text-lg">Los profesionales más solicitados de la semana.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <TiltCard
                                    className="group relative h-56 sm:h-64 rounded-[2rem] bg-card p-6 sm:p-8 shadow-xl shadow-primary/5 border border-border/60 backdrop-blur-sm hover:border-border hover:shadow-2xl hover:shadow-primary/15 active:shadow-2xl active:shadow-primary/15 transition-all duration-500 cursor-pointer"
                                    onClick={() => router.push(`/services/${category.id}`)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <motion.div
                                            className="text-5xl sm:text-6xl mb-4"
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {category.icon}
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold mb-1">{category.name}</h3>
                                            <p className="text-muted-foreground font-medium text-sm sm:text-base">{category.count} Profesionales</p>
                                        </div>
                                        <motion.div
                                            className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-active:bg-primary group-active:text-primary-foreground transition-colors duration-300"
                                            whileHover={{ scale: 1.15, rotate: 90 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                        </motion.div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-24 bg-background overflow-hidden relative">
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
                    <TestimonialsCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* Animated Stats Section */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 mix-blend-soft-light pointer-events-none" />
                <div className="container px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
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
                                >
                                    <div className="text-4xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-500">
                                        {stat.value}
                                    </div>
                                    <div className="text-white/70 font-medium text-sm md:text-base group-hover:text-white/90 transition-colors">{stat.label}</div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        viewport={{ once: true }}
                        className="bg-aurora p-[1px] rounded-[3rem] inline-block"
                    >
                        <div className="bg-card rounded-[3rem] p-12 sm:p-16 md:p-24 shadow-2xl shadow-primary/25 backdrop-blur-xl border border-border/80">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight text-foreground">
                                    ¿Listo para transformar tu hogar?
                                </h2>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto"
                            >
                                Únete a miles de usuarios que ya disfrutan de un servicio de calidad, rápido y seguro.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Button size="lg" className="h-14 px-8 sm:px-10 rounded-full text-base sm:text-lg bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all font-semibold whitespace-nowrap shimmer">
                                        Comenzar Ahora
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Button size="lg" variant="outline" className="h-14 px-8 sm:px-10 rounded-full text-base sm:text-lg border-2 hover:bg-muted font-semibold whitespace-nowrap transition-all">
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
