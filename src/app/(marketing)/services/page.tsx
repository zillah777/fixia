"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Wrench, Zap, Droplets, Paintbrush, Hammer, Truck, Scissors, Smartphone, Briefcase } from "lucide-react"
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
        <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
            <div className="text-center mb-10 sm:mb-12 space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Encuentra el servicio que necesitas</h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explora nuestras categorías y conecta con profesionales calificados en tu zona.
                </p>

                <div className="max-w-md mx-auto relative px-2 sm:px-0">
                    <Search className="absolute left-3 sm:left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar servicios (ej. Plomero, Electricista)..."
                        className="pl-10 h-10 sm:h-12 text-base sm:text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="h-48 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-6 w-20 rounded-full mt-4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {filteredCategories.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link href={`/services/${category.id}`} key={category.id}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                            {category.name}
                                        </CardTitle>
                                        <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {category.description}
                                        </p>
                                        <Badge variant="secondary">
                                            {category.count} Profesionales
                                        </Badge>
                                    </CardContent>
                                </Card>
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
