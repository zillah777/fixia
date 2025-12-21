"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Wrench, Zap, Droplets, Paintbrush, Hammer, Truck, Scissors, Smartphone, Briefcase, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import Link from "next/link"

// Mapping for Icons and Descriptions based on Category ID
const CATEGORY_META: Record<string, { icon: any, description: string }> = {
    "plomeria": { icon: Droplets, description: "Reparación de fugas, instalación de grifos y cañerías." },
    "electricidad": { icon: Zap, description: "Instalaciones eléctricas, reparación de cortocircuitos." },
    "gas": { icon: Wrench, description: "Instalación y reparación de artefactos a gas." },
    "pintura": { icon: Paintbrush, description: "Pintura de interiores y exteriores." },
    "carpinteria": { icon: Hammer, description: "Muebles a medida, reparaciones de madera." },
    "fletes": { icon: Truck, description: "Transporte de cargas y mudanzas." },
    "belleza": { icon: Scissors, description: "Peluquería, manicura y servicios de estética." },
    "tecnologia": { icon: Smartphone, description: "Reparación de celulares, computadoras y tablets." },
    "jardineria": { icon: Briefcase, description: "Mantenimiento de jardines y espacios verdes." }, // Added fallback
    "albanileria": { icon: Hammer, description: "Construcción, refacciones y albañilería en general." } // Added fallback
}

export default function ServicesPage() {
    const [search, setSearch] = useState("")
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/public/categories")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Transform API data to include Icon and Description
                    const formatted = data.map(cat => {
                        const meta = CATEGORY_META[cat.id] || { icon: Briefcase, description: "Servicios profesionales garantizados." }
                        return {
                            ...cat,
                            icon: meta.icon,
                            description: meta.description
                        }
                    })
                    setCategories(formatted)
                }
            })
            .catch(err => console.error("Failed to fetch categories", err))
            .finally(() => setLoading(false))
    }, [])

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            <div className="text-center mb-16 space-y-6 relative overflow-visible">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6a9bcc]/10 text-[#6a9bcc] text-[10px] font-black tracking-widest uppercase mb-4 border border-[#6a9bcc]/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Excelencia en cada oficio</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#141413] dark:text-[#faf9f5]">
                    Encuentra el servicio <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97757] via-[#6a9bcc] to-[#788c5d]">
                        que necesitas hoy.
                    </span>
                </h1>
                <p className="text-lg text-[#b0aea5] max-w-2xl mx-auto font-medium leading-relaxed">
                    Nuestra red de profesionales verificados está lista para transformar tus ideas en realidades tangibles.
                </p>

                <div className="max-w-xl mx-auto relative group mt-10">
                    <div className="absolute inset-x-0 -bottom-2 h-12 bg-[#d97757]/10 blur-2xl group-hover:bg-[#d97757]/20 transition-all rounded-full" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b0aea5] z-10" />
                    <Input
                        placeholder="¿Qué estás buscando? (ej. Plomero, Gasista 24hs)..."
                        className="pl-12 pr-4 h-14 text-lg bg-white dark:bg-[#1c1c1b] border-2 border-[#e8e6dc] dark:border-white/5 rounded-2xl focus:border-[#d97757] dark:focus:border-[#d97757] transition-all relative z-10 shadow-sm group-hover:shadow-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="h-64 border-none bg-white dark:bg-[#1c1c1b] rounded-[32px] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {filteredCategories.map((category, i) => {
                        const Icon = category.icon
                        const colors = [
                            'from-[#d97757]',
                            'from-[#6a9bcc]',
                            'from-[#788c5d]'
                        ]
                        const accentColor = i % 3 === 0 ? '#d97757' : i % 3 === 1 ? '#6a9bcc' : '#788c5d';

                        return (
                            <Link href={`/services/${category.id}`} key={category.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (i % 4) * 0.1 }}
                                >
                                    <Card className="group h-full border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer bg-white dark:bg-[#1c1c1b] rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between">
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[i % 3]} to-transparent opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />

                                        <div>
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110 duration-500"
                                                style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>
                                                <Icon className="h-8 w-8" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            </div>

                                            <h3 className="text-xl font-black text-[#141413] dark:text-[#faf9f5] mb-3 group-hover:text-[#d97757] transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-[#b0aea5] font-medium leading-relaxed mb-6">
                                                {category.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-[#e8e6dc]/30 dark:border-white/5">
                                            <Badge variant="secondary" className="bg-[#faf9f5] dark:bg-[#141413] text-[#141413] dark:text-[#faf9f5] border-none font-black text-[10px] uppercase tracking-wider py-1 px-3">
                                                {category.count} Pros
                                            </Badge>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#141413] text-[#b0aea5] group-hover:bg-[#d97757] group-hover:text-white transition-all duration-300">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            )}

            {!loading && filteredCategories.length === 0 && (
                <StandardizedEmptyState
                    icon={Search}
                    title="No se encontraron categorías"
                    description="No hay categorías de servicios que coincidan con tu búsqueda. Intenta con otros términos."
                    action={{
                        label: "Limpiar búsqueda",
                        onClick: () => setSearch(""),
                    }}
                />
            )}
        </div>
    )
}
