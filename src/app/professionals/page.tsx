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
import { useAuth } from "@/providers/auth-provider"
import { TrustBadgesGroup } from "@/components/ui/trust-badges"

function ProfessionalsList() {
    const searchParams = useSearchParams()
    const categoryParam = searchParams?.get("category")
    const { user } = useAuth()

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
                    const response = await res.json()
                    let data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : [])

                    // Filter out current user if they are a professional
                    if (user?.id && user?.role === 'PROFESSIONAL') {
                        data = data.filter((pro: Professional) => pro.id !== user.id)
                    }

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
    }, [search, categoryFilter, locationFilter, user?.id, user?.role])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profesionales Destacados</h1>
                    <p className="text-muted-foreground">Encuentra al experto ideal para tu proyecto.</p>
                </div>
            </div>

            {/* Filters - Mobile Optimized */}
            <Card className="mb-8 border-none shadow-sm bg-muted/30">
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="🔍 Buscar por nombre, oficio..."
                                className="pl-10 h-10 bg-background border-border/60 focus:bg-background transition-colors"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-10 bg-background border-border/60">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">🛠️ Todas</SelectItem>
                                <SelectItem value="plomeria">💧 Plomería</SelectItem>
                                <SelectItem value="electricidad">⚡ Electricidad</SelectItem>
                                <SelectItem value="gas">🔥 Gasista</SelectItem>
                                <SelectItem value="pintura">🎨 Pintura</SelectItem>
                                <SelectItem value="carpinteria">🪚 Carpintería</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative hidden md:block">
                            {/* Hidden on mobile to save space, or kept if essential. Let's keep simpler. */}
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ubicación"
                                className="pl-10 h-10 bg-background border-border/60"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>

                        <div className="md:hidden relative">
                            {/* Mobile Location */}
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ubicación (Opcional)"
                                className="pl-10 h-10 bg-background border-border/60"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Grid */}
            {loading ? (
                <div className="text-center py-12">Cargando profesionales...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionals.map((pro) => (
                        <Card key={pro.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50">
                            <CardHeader className="p-0">
                                <div className="h-28 bg-gradient-to-r from-primary/80 to-primary/40 relative">
                                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                                    {pro.verified && (
                                        <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0 backdrop-blur-sm shadow-sm gap-1 pl-1 pr-2">
                                            <CheckCircle className="h-3 w-3" /> Verificado
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0 px-6 pb-6 relative">
                                <div className="flex justify-between items-end mb-4 -mt-10">
                                    <Avatar className="h-24 w-24 border-[4px] border-background shadow-md">
                                        <AvatarImage src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} className="object-cover" />
                                        <AvatarFallback>{pro.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>

                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${Number(pro.rating) > 0
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-stone-100 text-stone-500 dark:bg-muted"
                                        }`}>
                                        <Star className={`h-4 w-4 ${Number(pro.rating) > 0 ? "fill-yellow-500 text-yellow-500" : "text-stone-300"}`} />
                                        {Number(pro.rating) > 0 ? (
                                            <>
                                                {Number(pro.rating).toFixed(1)} <span className="text-xs font-normal opacity-70">({pro.reviews})</span>
                                            </>
                                        ) : (
                                            <span className="text-xs font-medium">Nuevo</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1" title={pro.name}>{pro.name}</h3>
                                    <p className="text-primary font-medium text-sm">{pro.role}</p>
                                </div>

                                <div className="flex items-center text-muted-foreground text-xs mb-5">
                                    <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{pro.location}</span>
                                </div>

                                {/* Trust Badges */}
                                {pro.profile?.badges && pro.profile.badges.length > 0 && (
                                    <div className="mb-5 pb-5 border-b border-border/40">
                                        <TrustBadgesGroup
                                            badges={(pro.profile?.badges || []) as any}
                                            size="sm"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-5 min-h-[1.5rem]">
                                    {pro.tags && pro.tags.slice(0, 3).map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 h-5 bg-stone-100 dark:bg-muted text-stone-600 dark:text-stone-400">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {pro.tags && pro.tags.length > 3 && (
                                        <span className="text-[10px] text-muted-foreground self-center">+{pro.tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-sm pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Desde</span>
                                        <span className="font-bold text-lg text-primary">{pro.price.includes("$") ? pro.price.split("Desde ")[1] || pro.price : pro.price}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-stone-50/50 dark:bg-muted/10 px-6 py-4 border-t border-border/40">
                                <Link href={`/professionals/${pro.id}`} className="w-full">
                                    <Button className="w-full shadow-sm hover:shadow-md transition-all font-semibold" variant="outline">Ver Perfil</Button>
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
