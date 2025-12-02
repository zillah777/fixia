"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Wrench, Zap, Droplets, Paintbrush, Hammer, Truck, Scissors, Smartphone, Briefcase } from "lucide-react"
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
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Encuentra el servicio que necesitas</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explora nuestras categorías y conecta con profesionales calificados en tu zona.
                </p>

                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar servicios (ej. Plomero, Electricista)..."
                        className="pl-10 h-12 text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="h-48 animate-pulse bg-muted/50" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link href={`/professionals?category=${category.id}`} key={category.id}>
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
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No se encontraron categorías que coincidan con tu búsqueda.</p>
                </div>
            )}
        </div>
    )
}
