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
            {/* Hero Section with Spotlight Effect */}
            <section className="relative pt-8 pb-6 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d97757]/5 via-transparent to-transparent opacity-70 dark:from-[#d97757]/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] sm:h-[500px] bg-gradient-to-b from-[#d97757]/10 to-[#6a9bcc]/10 dark:from-[#d97757]/20 dark:to-[#6a9bcc]/20 blur-3xl sm:blur-[120px] rounded-full pointer-events-none" />

                <div className="container px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mx-auto max-w-4xl space-y-5 sm:space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Badge variant="outline" className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm border-[#d97757]/30 bg-[#d97757]/10 text-[#d97757] font-medium text-xs sm:text-sm hover:bg-[#d97757]/20 transition-colors duration-300">
                                ✨ La forma más inteligente de contratar
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                        >
                            <span className="block text-foreground mb-1 sm:mb-3 font-medium">
                                Servicios confiables,
                            </span>
                            <span className="block text-foreground mb-2 sm:mb-4">
                                sin complicaciones.
                            </span>
                            <Image
                                src="/logo.png"
                                alt="Fixia Logo"
                                width={400}
                                height={130}
                                className="inline-block h-24 sm:h-48 md:h-64 lg:h-80 w-auto object-contain -mt-1 sm:-mt-4"
                            />
                        </motion.h1>

                        <p className="mx-auto max-w-2xl text-sm sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-2">
                            Conectamos tus necesidades con los mejores profesionales verificados.
                            Desde reparaciones hasta proyectos especiales, con garantía total.
                        </p>

                        {/* Floating Search Bar - Fully Responsive - Optimized Mobile */}
                        <motion.form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const query = formData.get('search') as string
                                if (query?.trim()) {
                                    window.location.href = `/services?q=${encodeURIComponent(query.trim())}`
                                } else {
                                    window.location.href = '/services'
                                }
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="mx-auto w-full max-w-2xl bg-white dark:bg-card rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl shadow-[#d97757]/10 border border-[#6a9bcc]/20 hover:border-[#d97757]/30 dark:border-border/50 backdrop-blur-md flex items-center p-1.5 sm:p-2 gap-2 transition-all duration-300 ring-2 ring-transparent focus-within:ring-[#d97757]/20 focus-within:border-[#d97757]/50"
                        >
                            <div className="pl-2 sm:pl-3 text-muted-foreground flex-shrink-0">
                                <Search className="h-4 sm:h-5 w-4 sm:w-5" style={{ color: "#d97757" }} />
                            </div>
                            <Input
                                name="search"
                                className="border-none shadow-none bg-transparent h-10 sm:h-12 text-sm sm:text-base px-2 placeholder:text-muted-foreground/70 focus-visible:ring-0 flex-1 min-w-0"
                                placeholder="Ej: Plomero, Electricista..."
                                autoComplete="off"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="rounded-lg sm:rounded-xl px-3 sm:px-6 font-bold shadow-md h-9 sm:h-11 bg-gradient-to-r from-[#d97757] to-[#d97757]/90 hover:from-[#d97757]/90 hover:to-[#d97757] text-white transition-all text-xs sm:text-base"
                            >
                                Buscar
                            </Button>
                        </motion.form>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-6 lg:gap-8 pt-4 sm:pt-8 opacity-60 hover:opacity-100 transition-all duration-500">
                            {["Profesionales Verificados", "Garantía de Calidad", "100% Confiable"].map((text, i) => (
                                <div key={i} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" style={{ color: "#788c5d" }} />
                                    <span className="whitespace-nowrap">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Preview Section */}
            <section className="py-12 sm:py-20 lg:py-28 relative overflow-hidden bg-stone-50 dark:bg-muted/10">
                <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
                    <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-[#d97757]/10 dark:bg-[#d97757]/20 rounded-full blur-2xl sm:blur-3xl" />
                    <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-[#6a9bcc]/10 dark:bg-[#6a9bcc]/20 rounded-full blur-2xl sm:blur-3xl" />
                </div>
                <div className="container px-4 sm:px-6 relative z-10">

                    {/* Clients Flow */}
                    <div className="mb-16 sm:mb-20">
                        <div className="text-center mb-8 sm:mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4 text-stone-900 dark:text-foreground">
                                    ¿Cómo funciona?
                                </h2>
                                <p className="text-stone-600 dark:text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
                                    La forma más simple de solucionar tus pendientes del hogar
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    title: "1. Cuéntanos qué necesitas",
                                    desc: "Describe tu proyecto o reparación. Es gratis y te tomará menos de 2 minutos.",
                                    icon: <Search className="h-6 w-6" />,
                                    color: "text-[#d97757]",
                                    bgColor: "bg-[#d97757]/10 dark:bg-[#d97757]/20"
                                },
                                {
                                    title: "2. Elige con Confianza",
                                    desc: "Recibe propuestas y compara perfiles verificados con reseñas reales.",
                                    icon: <CheckCircle2 className="h-6 w-6" />,
                                    color: "text-[#6a9bcc]",
                                    bgColor: "bg-[#6a9bcc]/10 dark:bg-[#6a9bcc]/20"
                                },
                                {
                                    title: "3. Conecta Directo",
                                    desc: "Sin intermediarios. Habla directamente con el profesional y acuerda el precio.",
                                    icon: <Sparkles className="h-6 w-6" />,
                                    color: "text-[#788c5d]",
                                    bgColor: "bg-[#788c5d]/10 dark:bg-[#788c5d]/20"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative group"
                                >
                                    <div className="h-full p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-card border border-stone-200 dark:border-border shadow-sm hover:shadow-lg hover:shadow-current/10 transition-all duration-300 text-center overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 ${step.bgColor} rounded-full blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        <div className={`mx-auto w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl ${step.bgColor} ${step.color} flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 flex-shrink-0`}>
                                            {step.icon}
                                        </div>
                                        <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-stone-900 dark:text-foreground relative z-10">{step.title}</h3>
                                        <p className="text-xs sm:text-sm text-stone-600 dark:text-muted-foreground leading-relaxed relative z-10">{step.desc}</p>
                                        <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${step.bgColor} rounded-full blur-xl opacity-30`} />
                                    </div>
                                    {i < 2 && (
                                        <div className="hidden sm:block absolute top-1/2 -right-3 sm:-right-4 -translate-y-1/2 text-[#d97757]/20 sm:text-[#d97757]/30 dark:text-[#d97757]/40 z-10">
                                            <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Professionals Flow */}
                    <div className="max-w-5xl mx-auto pt-12 border-t border-stone-200 dark:border-border">
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-sm font-semibold text-[#d97757] uppercase tracking-wider mb-2 block">Para Profesionales</span>
                                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-foreground mb-4">
                                    Haz crecer tu negocio
                                </h3>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Crea tu Perfil",
                                    desc: "Destaca tus habilidades y experiencia para atraer clientes.",
                                    icon: <Shield className="h-5 w-5" />,
                                    color: "text-[#d97757]",
                                    bgColor: "bg-[#d97757]/10 dark:bg-[#d97757]/20"
                                },
                                {
                                    title: "Recibe Solicitudes",
                                    desc: "Accede a oportunidades de trabajo reales en tu zona.",
                                    icon: <Search className="h-5 w-5" />,
                                    color: "text-[#6a9bcc]",
                                    bgColor: "bg-[#6a9bcc]/10 dark:bg-[#6a9bcc]/20"
                                },
                                {
                                    title: "Gana Clientes",
                                    desc: "Construye tu reputación y fideliza a tus clientes.",
                                    icon: <Star className="h-5 w-5" />,
                                    color: "text-[#788c5d]",
                                    bgColor: "bg-[#788c5d]/10 dark:bg-[#788c5d]/20"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                                        <div className={`w-12 h-12 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {step.icon}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 text-stone-900 dark:text-foreground">{step.title}</h4>
                                        <p className="text-sm text-stone-600 dark:text-muted-foreground">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link href="/become-a-pro">
                                <Button variant="outline" className="rounded-full border-[#d97757] text-[#d97757] hover:bg-[#d97757]/10 dark:border-[#d97757] dark:text-[#d97757] dark:hover:bg-[#d97757]/20 font-semibold">
                                    Soy Profesional
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link href="/how-it-works">
                            <Button variant="link" className="text-stone-900 dark:text-primary font-semibold text-lg hover:no-underline group">
                                Ver proceso detallado <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

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
                                            className="text-2xl sm:text-5xl mb-1 sm:mb-3 flex-shrink-0"
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
                            <div className="col-span-4 text-center text-muted-foreground">Cargando categorías...</div>
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
                        {stats.map((stat, index) => {
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
                        })}
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
