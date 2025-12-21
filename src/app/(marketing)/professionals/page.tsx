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
import { Star, MapPin, Search, Filter, CheckCircle, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Professional } from "@/types/professional"
import { useAuth } from "@/providers/auth-provider"
import { TrustBadgesGroup } from "@/components/ui/trust-badges"
import { Skeleton } from "@/components/ui/skeleton"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"

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
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profesionales Destacados</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Encuentra al experto ideal para tu proyecto.</p>
                </div>
            </div>

            {/* Filters - Mobile Optimized */}
            <Card className="mb-6 sm:mb-8 border-none shadow-sm bg-muted/30">
                <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden border-border/50">
                            <Skeleton className="h-28 w-full" />
                            <CardContent className="pt-0 px-4 sm:px-6 pb-6 relative">
                                <div className="flex justify-between items-end mb-4 -mt-8 sm:-mt-10">
                                    <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-[4px] border-background" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                                <div className="space-y-2 mb-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-4 w-full mb-5" />
                                <div className="flex gap-2 mb-5">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-visible">
                    {professionals.map((pro) => (
                        <motion.div
                            key={pro.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="group h-full overflow-hidden border-none bg-white dark:bg-[#1c1c1b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(217,119,87,0.1)] transition-all duration-500 rounded-[32px] relative flex flex-col">
                                <CardHeader className="p-0 relative">
                                    <div className="h-32 w-full overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#d97757]/80 to-[#6a9bcc]/40 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                                    </div>

                                    {pro.verified && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <Badge className="bg-white/95 dark:bg-[#141413]/90 text-[#788c5d] border-none shadow-sm backdrop-blur-md gap-1 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                                                <CheckCircle className="h-3 w-3 fill-[#788c5d] text-white" /> Certificado
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="absolute -bottom-10 left-6 z-20">
                                        <div className="relative">
                                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-[6px] border-[#faf9f5] dark:border-[#1c1c1b] shadow-2xl rounded-[28px] overflow-hidden">
                                                <AvatarImage src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} className="object-cover" />
                                                <AvatarFallback className="bg-[#e8e6dc] text-[#141413] font-bold">{pro.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#788c5d] border-[3px] border-[#faf9f5] dark:border-[#1c1c1b] rounded-full" />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-14 px-6 pb-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-[#141413] dark:text-[#faf9f5] group-hover:text-[#d97757] transition-colors leading-tight">{pro.name}</h3>
                                            <p className="text-[#d97757] font-bold text-xs uppercase tracking-widest">{pro.role}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${Number(pro.rating) > 0
                                                ? "bg-[#faf9f5] text-[#141413] border border-[#e8e6dc]"
                                                : "bg-[#e8e6dc]/30 text-[#b0aea5]"
                                                }`}>
                                                <Star className={`h-3.5 w-3.5 ${Number(pro.rating) > 0 ? "fill-[#d97757] text-[#d97757]" : "text-[#b0aea5]"}`} />
                                                {Number(pro.rating) > 0 ? Number(pro.rating).toFixed(1) : "Nuev@"}
                                            </div>
                                            <span className="text-[10px] text-[#b0aea5] mt-1 font-medium">{pro.reviews} reseñas</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-[#b0aea5] text-xs font-medium mb-6">
                                        <div className="flex items-center bg-[#faf9f5] dark:bg-[#141413]/50 px-3 py-1.5 rounded-full border border-[#e8e6dc]/40">
                                            <MapPin className="h-3 w-3 mr-1.5 text-[#6a9bcc]" />
                                            <span className="truncate">{pro.location}</span>
                                        </div>
                                    </div>

                                    {/* Skills Badges */}
                                    <div className="flex flex-wrap gap-1.5 mb-6 min-h-[1.5rem]">
                                        {pro.tags && pro.tags.slice(0, 3).map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="text-[9px] px-2.5 h-6 bg-[#e8e6dc]/40 dark:bg-[#141413]/40 text-[#141413] dark:text-[#faf9f5] border-none font-bold uppercase tracking-tighter">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {pro.tags && pro.tags.length > 3 && (
                                            <span className="text-[10px] text-[#b0aea5] self-center ml-1">+{pro.tags.length - 3}</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center bg-[#faf9f5] dark:bg-[#141413]/30 p-4 rounded-2xl border border-[#e8e6dc]/50 dark:border-white/5 mx-[-8px]">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase text-[#b0aea5] font-black tracking-widest">Inversión</span>
                                            <span className="font-black text-lg text-[#141413] dark:text-[#faf9f5]">
                                                {pro.price.includes("$") ? pro.price.split("Desde ")[1] || pro.price : pro.price}
                                            </span>
                                        </div>
                                        <Link href={`/professionals/${pro.id}`}>
                                            <Button size="sm" className="bg-[#141413] dark:bg-[#faf9f5] text-white dark:text-[#141413] rounded-xl font-bold px-4 hover:bg-[#d97757] dark:hover:bg-[#d97757] transition-colors border-none">
                                                Ver Perfil
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && professionals.length === 0 && (
                <StandardizedEmptyState
                    icon={Search}
                    title="No se encontraron profesionales"
                    description="No hay profesionales que coincidan con tus criterios de búsqueda."
                    action={{
                        label: "Limpiar filtros",
                        onClick: () => {
                            setSearch("")
                            setCategoryFilter("all")
                            setLocationFilter("")
                        }
                    }}
                />
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
