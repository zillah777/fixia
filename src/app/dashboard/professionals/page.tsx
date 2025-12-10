"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PublicProfileCard } from "@/components/profile/public-profile-card"
import { useDebounce } from "@/hooks/use-debounce"

interface Professional {
    id: string
    name: string
    avatar: string | null
    role: string
    profile?: {
        bio?: string
        locationLat?: number
        locationLng?: number
        ratingAvg?: number
        badges?: string[]
    }
    reviewCount?: number
    _count?: {
        reviewsReceived: number
    }
}

export default function ProfessionalsPage() {
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const debouncedSearch = useDebounce(search, 300)

    useEffect(() => {
        fetchProfessionals()
    }, [debouncedSearch, page])

    const fetchProfessionals = async () => {
        setLoading(true)
        try {
            let url = `/api/professionals?page=${page}&limit=20`
            if (debouncedSearch) {
                url += `&search=${encodeURIComponent(debouncedSearch)}`
            }

            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                const professionalsList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])
                setProfessionals(Array.isArray(professionalsList) ? professionalsList : [])

                if (data.pagination) {
                    setTotalPages(data.pagination.pages)
                }
            } else {
                setProfessionals([])
            }
        } catch (error) {
            console.error("Error fetching professionals:", error)
            setProfessionals([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Explorar Profesionales
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Descubre profesionales verificados en tu área
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o especialidad..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : professionals.length === 0 ? (
                /* Empty State */
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        No se encontraron profesionales con esos criterios
                    </p>
                    <Button variant="outline" onClick={() => {
                        setSearch("")
                        setPage(1)
                    }}>
                        Limpiar búsqueda
                    </Button>
                </Card>
            ) : (
                <>
                    {/* Grid of Professionals */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {professionals.map((professional) => (
                            <PublicProfileCard
                                key={professional.id}
                                id={professional.id}
                                name={professional.name}
                                avatar={professional.avatar}
                                role={professional.role as "CLIENT" | "PROFESSIONAL"}
                                bio={professional.profile?.bio}
                                location={
                                    professional.profile?.locationLat
                                        ? `Lat: ${professional.profile.locationLat.toFixed(2)}, Lng: ${professional.profile.locationLng?.toFixed(2)}`
                                        : undefined
                                }
                                badges={
                                    typeof professional.profile?.badges === "string"
                                        ? JSON.parse(professional.profile.badges)
                                        : professional.profile?.badges
                                }
                                averageRating={professional.profile?.ratingAvg || 0}
                                reviewCount={
                                    professional._count?.reviewsReceived ||
                                    professional.reviewCount ||
                                    0
                                }
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Anterior
                            </Button>
                            <div className="flex items-center gap-2 px-4">
                                <span className="text-sm text-muted-foreground">
                                    Página {page} de {totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
