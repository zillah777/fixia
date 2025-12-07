"use client"

import { useState, useEffect } from "react"
import { ServiceCard } from "@/components/services/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Loader2, Star, CheckCircle, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = [
    { id: "all", label: "Todos", icon: "🔍" },
    { id: "electricidad", label: "Electricidad", icon: "⚡" },
    { id: "plomeria", label: "Plomería", icon: "💧" },
    { id: "pintura", label: "Pintura", icon: "🎨" },
    { id: "gas", label: "Gas", icon: "🔥" },
    { id: "carpinteria", label: "Carpintería", icon: "🪚" },
    { id: "jardineria", label: "Jardinería", icon: "🌱" },
    { id: "tecnologia", label: "Tecnología", icon: "💻" },
    { id: "fletes", label: "Fletes", icon: "🚚" },
    { id: "belleza", label: "Belleza", icon: "💇" },
]

export default function OffersPage() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [search, setSearch] = useState("")

    // Adaptive Filters
    const [minRating, setMinRating] = useState(0)
    const [selectedBadges, setSelectedBadges] = useState<string[]>([])
    const [locationSearch, setLocationSearch] = useState("")

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (selectedCategory !== "all") params.append("category", selectedCategory)
                if (search) params.append("search", search)
                if (minRating > 0) params.append("rating", minRating.toString())
                if (selectedBadges.length > 0) selectedBadges.forEach(b => params.append("badges", b))

                // Note: Location filter not fully implemented on backend yet
                if (locationSearch) params.append("location", locationSearch)

                const res = await fetch(`/api/public/services?${params.toString()}`)
                if (res.ok) {
                    const data = await res.json()
                    setServices(data)
                }
            } catch (error) {
                console.error("Failed to fetch services", error)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(() => {
            fetchServices()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [selectedCategory, search, minRating, selectedBadges, locationSearch])

    const toggleBadge = (badge: string) => {
        setSelectedBadges(prev =>
            prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Sticky Header with Search */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 py-4 space-y-4">
                    {/* Top Bar: Search & Filters */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="flex items-center gap-4 w-full md:max-w-xl bg-white dark:bg-zinc-900 border shadow-sm rounded-full px-4 py-2.5 transition-shadow hover:shadow-md">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground"
                                placeholder="¿Qué servicio estás buscando?"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="h-6 w-px bg-muted mx-2 hidden md:block" />
                            {/* Location - Visual only for now */}
                            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Buenos Aires</span>
                            </div>
                            <button className="p-2 ml-2 rounded-full bg-primary text-primary-foreground hover:opacity-90">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Filters Button / Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full border-dashed hidden md:flex">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros
                                    {selectedBadges.length > 0 && <Badge variant="secondary" className="ml-2 px-1 text-[10px]">{selectedBadges.length}</Badge>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Calificación Mínima</DropdownMenuLabel>
                                {[4, 3, 0].map(stars => (
                                    <DropdownMenuCheckboxItem
                                        key={stars}
                                        checked={minRating === stars}
                                        onCheckedChange={() => setMinRating(stars)}
                                    >
                                        {stars === 0 ? "Cualquiera" : `${stars}+ Estrellas`}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Insignias</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                    checked={selectedBadges.includes("VERIFIED")}
                                    onCheckedChange={() => toggleBadge("VERIFIED")}
                                >
                                    <CheckCircle className="mr-2 h-3 w-3 text-blue-500" /> Verificado
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={selectedBadges.includes("PREMIUM")}
                                    onCheckedChange={() => toggleBadge("PREMIUM")}
                                >
                                    <Star className="mr-2 h-3 w-3 text-yellow-500" /> Premium
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Categories Scroll */}
                    <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex flex-col items-center gap-2 min-w-[64px] transition-all relative pb-2 group
                                    ${selectedCategory === cat.id
                                        ? "text-black dark:text-white"
                                        : "text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100"
                                    }`}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
                                {selectedCategory === cat.id && (
                                    <span className="absolute bottom-0 w-8 h-[2px] bg-black dark:bg-white rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Active Filters Display */}
                {(minRating > 0 || selectedBadges.length > 0) && (
                    <div className="flex gap-2 mb-6">
                        {minRating > 0 && (
                            <Badge variant="outline" className="pl-2 pr-1 py-1 gap-1" onClick={() => setMinRating(0)}>
                                {minRating}+ <Star className="h-3 w-3 fill-current" />
                                <span className="ml-1 cursor-pointer hover:bg-muted rounded-full p-0.5">×</span>
                            </Badge>
                        )}
                        {selectedBadges.map(b => (
                            <Badge key={b} variant="outline" className="pl-2 pr-1 py-1 gap-1" onClick={() => toggleBadge(b)}>
                                {b}
                                <span className="ml-1 cursor-pointer hover:bg-muted rounded-full p-0.5">×</span>
                            </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => { setMinRating(0); setSelectedBadges([]); }}>
                            Limpiar todos
                        </Button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <div className="aspect-[20/19] rounded-xl bg-muted animate-pulse" />
                                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {services.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                                {services.map((service) => (
                                    <ServiceCard key={service.id} data={service} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
                                <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearch("")
                                        setSelectedCategory("all")
                                        setMinRating(0)
                                        setSelectedBadges([])
                                    }}
                                >
                                    Limpiar todos los filtros
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Filter Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full shadow-lg h-12 px-6 bg-black text-white hover:scale-105 transition-transform">
                            Filtros <SlidersHorizontal className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72" align="center">
                        <DropdownMenuLabel>Filtrar resultados</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <p className="text-xs font-medium mb-2">Calificación</p>
                            <div className="flex gap-2">
                                {[4, 3, 0].map(s => (
                                    <Button
                                        key={s}
                                        variant={minRating === s ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setMinRating(s)}
                                        className="flex-1"
                                    >
                                        {s === 0 ? "Todas" : `${s}+ ⭐`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="p-2">
                            <p className="text-xs font-medium mb-2">Insignias</p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="m-verified" checked={selectedBadges.includes("VERIFIED")} onChange={() => toggleBadge("VERIFIED")} />
                                    <label htmlFor="m-verified" className="text-sm">Verificado</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="m-premium" checked={selectedBadges.includes("PREMIUM")} onChange={() => toggleBadge("PREMIUM")} />
                                    <label htmlFor="m-premium" className="text-sm">Premium</label>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
