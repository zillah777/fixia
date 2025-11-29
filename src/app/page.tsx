"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import { Search, MapPin, Star, Shield, Clock, ArrowRight, CheckCircle2, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"

// 3D Tilt Card Component
function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
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
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-[#F3F4F6]">
            {/* Hero Section with Spotlight Effect */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mx-auto max-w-4xl space-y-8"
                    >
                        <Badge variant="outline" className="px-4 py-2 rounded-full border-blue-200 bg-blue-50 text-blue-700 backdrop-blur-sm animate-pulse">
                            ✨ La forma más inteligente de contratar
                        </Badge>

                        <h1 className="text-6xl font-bold tracking-tight sm:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 drop-shadow-sm">
                            Expertos en tu hogar,<br />
                            <span className="text-aurora text-glow">al instante.</span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                            Conectamos tus necesidades con los mejores profesionales de tu zona.
                            Sin esperas, sin complicaciones, con garantía total.
                        </p>

                        {/* Floating Search Bar */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="mx-auto max-w-2xl p-2 bg-white rounded-full shadow-2xl shadow-blue-500/10 border border-white/50 backdrop-blur-xl flex items-center gap-2"
                        >
                            <div className="pl-4 text-muted-foreground">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                className="border-none shadow-none bg-transparent h-12 text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0"
                                placeholder="¿Qué necesitas arreglar hoy?"
                            />
                            <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-gray-800 hover:shadow-lg transition-all">
                                Buscar
                            </Button>
                        </motion.div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {["Verified Pros", "Secure Payment", "Money Back Guarantee"].map((text, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> {text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3D Tilt Categories Section */}
            <section className="py-24 relative">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Servicios Populares</h2>
                        <p className="text-muted-foreground text-lg">Los profesionales más solicitados de la semana.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <TiltCard key={category.id} className="group relative h-64 rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5 border border-white/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`} />
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                        <p className="text-muted-foreground font-medium">{category.count} Profesionales</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-24 bg-background overflow-hidden">
                <div className="container px-4">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Lo que dicen nuestros clientes</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Miles de usuarios han encontrado el profesional perfecto a través de Fixia</p>
                    </div>
                    <TestimonialsCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* Animated Stats Section */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="container px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-5xl md:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                                    {stat.value}
                                </div>
                                <div className="text-white/60 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Immersive CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="container px-4 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-aurora p-[1px] rounded-[3rem] inline-block"
                    >
                        <div className="bg-white rounded-[3rem] p-16 md:p-24 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                                ¿Listo para transformar tu hogar?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                                Únete a miles de usuarios que ya disfrutan de un servicio de calidad, rápido y seguro.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-black text-white hover:scale-105 transition-transform shadow-xl shadow-black/20 shimmer">
                                    Comenzar Ahora
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg border-2 hover:bg-gray-50">
                                    Ver Servicios
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
