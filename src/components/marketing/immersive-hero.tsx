"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const slides = [
    {
        image: "/assets/marketing/client-hero.png",
        title: "Soluciones a un Clic",
        highlight: "Para tu Hogar",
        desc: "Encontrá al profesional ideal para tu casa en segundos. Confiable, rápido y cerca tuyo.",
        cta: "Buscar Servicio",
        filter: "sepia(0.3) saturate(1.2) hue-rotate(-20deg)" // Adjusting to remove green vibe
    },
    {
        image: "/assets/marketing/pro-hero.png",
        title: "Oficios que Cumplen",
        highlight: "Profesionales de Verdad",
        desc: "Conectamos especialistas independientes con clientes que valoran el trabajo bien hecho.",
        cta: "Ser Profesional",
        filter: "none"
    }
]

export function ImmersiveHero() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
            {/* Background Slider */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover object-center"
                        style={{ filter: slides[current].filter }}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60" />
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-10 px-4 sm:px-6">
                <div className="max-w-3xl space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                                {slides[current].title} <br />
                                <span className="text-[#d97757]">{slides[current].highlight}</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
                                {slides[current].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-white/20 shadow-2xl max-w-2xl"
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const query = formData.get('search') as string
                                window.location.href = query?.trim() ? `/services?q=${encodeURIComponent(query.trim())}` : '/services'
                            }}
                            className="flex items-center gap-2"
                        >
                            <div className="pl-4 text-white/60">
                                <Search className="h-6 w-6" />
                            </div>
                            <Input
                                name="search"
                                className="border-none bg-transparent h-12 text-base sm:text-lg text-white placeholder:text-white/40 focus-visible:ring-0 flex-1"
                                placeholder="Busca un profesional ahora..."
                                autoComplete="off"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-[#d97757] hover:bg-[#d97757]/90 text-white font-bold px-6 sm:px-8 h-10 sm:h-12 rounded-xl"
                            >
                                Buscar
                            </Button>
                        </form>
                    </motion.div>

                    {/* Premium Slider Navigation */}
                    <div className="flex items-center gap-4">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className="group relative py-4 outline-none"
                            >
                                <div
                                    className={`h-1 rounded-full transition-all duration-700 ease-out ${current === i ? "bg-[#d97757] w-16 sm:w-24" : "bg-white/20 w-8 sm:w-12 group-hover:bg-white/40"
                                        }`}
                                />
                                <span className={`absolute -top-1 left-0 text-[10px] font-bold tracking-widest uppercase transition-opacity duration-300 ${current === i ? "opacity-100 text-[#d97757]" : "opacity-0"
                                    }`}>
                                    0{i + 1}
                                    <motion.span
                                        initial={{ width: 0 }}
                                        animate={{ width: current === i ? "100%" : 0 }}
                                        className="block h-[1px] bg-[#d97757]"
                                    />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    )
}
