"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ImmersiveHero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/marketing/hero-pros.png"
                    alt="Profesionales de Fixia"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60" />
            </div>

            <div className="container relative z-10 px-4 sm:px-6">
                <div className="max-w-3xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                            Soluciones Expertas <br />
                            <span className="text-[#d97757]">Para Todo lo que Necesitas</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
                            Conectamos empresas, oficinas y hogares con la red de profesionales más grande y confiable de Argentina.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl max-w-2xl"
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
                                className="border-none bg-transparent h-14 text-lg text-white placeholder:text-white/40 focus-visible:ring-0 flex-1"
                                placeholder="¿Qué servicio estás buscando hoy?"
                                autoComplete="off"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-[#d97757] hover:bg-[#d97757]/90 text-white font-bold px-8 h-12 rounded-xl"
                            >
                                Buscar
                            </Button>
                        </form>
                    </motion.div>

                    <div className="flex flex-wrap gap-8 pt-4">
                        {[
                            { label: "+10k", sub: "Profesionales" },
                            { label: "4.9/5", sub: "Calificación" },
                            { label: "24/7", sub: "Soporte" }
                        ].map((stat, i) => (
                            <div key={i} className="text-white">
                                <span className="block text-2xl font-bold">{stat.label}</span>
                                <span className="text-sm text-white/60">{stat.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    )
}
