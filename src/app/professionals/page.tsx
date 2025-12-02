"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Search, Filter } from "lucide-react"
import { Professional } from "@/types/professional"

function ProfessionalsList() {
    const searchParams = useSearchParams()
    const categoryParam = searchParams.get("category")

    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState(categoryParam || "all")
    const [locationFilter, setLocationFilter] = useState("")
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch professionals on mount and when filters change
    React.useEffect(() => {
        const fetchPros = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (search) params.append("search", search)
                if (categoryFilter && categoryFilter !== "all") params.append("category", categoryFilter)
                if (locationFilter) params.append("location", locationFilter)

                const res = await fetch(`/api/professionals?${params.toString()}`)
                if (res.ok) {
                    const data: Professional[] = await res.json()
                    setProfessionals(data)
                }
            } catch (error) {
                console.error("Failed to fetch professionals", error)
            } finally {
                setLoading(false)
            }
        }

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchPros()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search, categoryFilter, locationFilter])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profesionales Destacados</h1>
                    <p className="text-muted-foreground">Encuentra al experto ideal para tu proyecto.</p>
                </div>
                <Button>Publicar una Solicitud</Button>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o rol..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                <SelectItem value="plomeria">Plomería</SelectItem>
                                <SelectItem value="electricidad">Electricidad</SelectItem>
                                <SelectItem value="gas">Gasista</SelectItem>
                                <SelectItem value="pintura">Pintura</SelectItem>
                                <SelectItem value="carpinteria">Carpintería</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative">
                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ubicación..."
                                className="pl-9"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>

                        <Button variant="outline" className="w-full">
                            <Filter className="mr-2 h-4 w-4" />
                            Más Filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Grid */}
            {loading ? (
                <div className="text-center py-12">Cargando profesionales...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionals.map((pro) => (
                        <Card key={pro.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="p-0">
                                <div className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                                    {pro.verified && (
                                        <Badge className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                                            Verificado
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 px-6 pb-6">
                                <div className="relative -mt-12 mb-4 flex justify-between items-end">
                                    <Avatar className="h-24 w-24 border-4 border-background">
                                        <AvatarImage src={pro.image} />
                                        <AvatarFallback>{pro.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium dark:bg-yellow-900 dark:text-yellow-200">
                                        <Star className="h-3 w-3 fill-yellow-600 text-yellow-600" />
                                        {Number(pro.rating).toFixed(1)} ({pro.reviews})
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold">{pro.name}</h3>
                                    <p className="text-primary font-medium">{pro.role}</p>
                                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {pro.location}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {pro.tags && pro.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Precio estimado:</span>
                                    <span className="font-semibold">{pro.price}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 px-6 py-4">
                                <Link href={`/professionals/${pro.id}`} className="w-full">
                                    <Button className="w-full">Ver Perfil</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && professionals.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No se encontraron profesionales con esos criterios.</p>
                    <Button variant="link" onClick={() => {
                        setSearch("")
                        setCategoryFilter("all")
                        setLocationFilter("")
                    }}>
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    )
}

export default function ProfessionalsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-8 text-center">Cargando...</div>}>
            <ProfessionalsList />
        </Suspense>
    )
}
