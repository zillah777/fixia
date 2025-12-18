"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { PublicProfileCard } from "@/components/profile/public-profile-card"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import { useDebounce } from "@/hooks/use-debounce"

interface Client {
    id: string
    name: string
    avatar: string | null
    role: string
    profile?: {
        bio?: string
    }
    _count?: {
        reviewsReceived: number
    }
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const debouncedSearch = useDebounce(search, 300)

    const fetchClients = useCallback(async () => {
        setLoading(true)
        try {
            let url = `/api/users?role=CLIENT&page=${page}&limit=20`
            if (debouncedSearch) {
                url += `&search=${encodeURIComponent(debouncedSearch)}`
            }

            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                const clientsList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])
                setClients(Array.isArray(clientsList) ? clientsList : [])

                if (data.pagination) {
                    setTotalPages(data.pagination.pages)
                }
            } else {
                setClients([])
            }
        } catch (error) {
            console.error("Error fetching clients:", error)
            setClients([])
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, page])

    useEffect(() => {
        fetchClients()
    }, [fetchClients])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Explorar Clientes
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Descubre clientes y oportunidades de negocio
                    </p>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : clients.length === 0 ? (
                /* Empty State */
                <StandardizedEmptyState
                    icon={Search}
                    title="No se encontraron clientes"
                    description="No hay clientes que coincidan con tus criterios de búsqueda. Intenta con otros términos o limpia los filtros."
                    action={{
                        label: "Limpiar búsqueda",
                        onClick: () => {
                            setSearch("")
                            setPage(1)
                        },
                    }}
                />
            ) : (
                <>
                    {/* Grid of Clients */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {clients.map((client) => (
                            <PublicProfileCard
                                key={client.id}
                                id={client.id}
                                name={client.name}
                                avatar={client.avatar}
                                role={client.role as "CLIENT" | "PROFESSIONAL"}
                                bio={client.profile?.bio}
                                reviewCount={client._count?.reviewsReceived || 0}
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
