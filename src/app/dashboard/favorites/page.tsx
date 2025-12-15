"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Star, Trash2, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"
import { toast } from "sonner"
import Link from "next/link"
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils"

interface Professional {
    id: string
    name: string
    avatar: string | null
    profile?: {
        bio?: string
        ratingAvg?: number
        tags?: string[]
    }
    _count?: {
        reviewsReceived: number
    }
}

interface FavoriteItem {
    id: string
    professional: Professional
    createdAt: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const { confirm, ConfirmDialog } = useConfirmDialog()

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/favorites?limit=100")
            if (res.ok) {
                const data = await res.json()
                setFavorites(Array.isArray(data.data) ? data.data : [])
            } else if (res.status === 401) {
                toast.error("Debes iniciar sesión")
            }
        } catch (error) {
            console.error("Error fetching favorites:", error)
            toast.error("Error cargando favoritos")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFavorite = (favoriteId: string, proName: string) => {
        confirm(
            "Remover de Favoritos",
            `¿Estás seguro que deseas remover a ${proName} de tus favoritos?`,
            async () => {
                setDeletingId(favoriteId)
                try {
                    const res = await fetch(`/api/favorites/${favoriteId}`, {
                        method: "DELETE",
                    })

                    if (res.ok) {
                        setFavorites(favorites.filter(f => f.id !== favoriteId))
                        toast.success("Removido de favoritos")
                    } else {
                        toast.error("Error al remover")
                    }
                } catch (error) {
                    console.error("Error removing favorite:", error)
                    toast.error("Error al remover favorito")
                } finally {
                    setDeletingId(null)
                }
            },
            { actionLabel: "Remover", cancelLabel: "Cancelar" }
        )
    }

    const filteredFavorites = favorites.filter(fav =>
        fav.professional.name.toLowerCase().includes(search.toLowerCase()) ||
        (fav.professional.profile?.bio?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )

    return (
        <div className="space-y-6">
            <ConfirmDialog />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mis Favoritos</h1>
                <p className="text-muted-foreground mt-2">
                    Profesionales que has guardado para contactar después
                </p>
            </div>

            {/* Search Bar */}
            {!loading && favorites.length > 0 && (
                <div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o especialidad..."
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : favorites.length === 0 ? (
                /* Empty State */
                <StandardizedEmptyState
                    icon={Heart}
                    title="No tienes favoritos aún"
                    description="Explora profesionales y guarda tus favoritos para contactarlos después fácilmente."
                    action={{
                        label: "Explorar Profesionales",
                        onClick: () => window.location.href = "/dashboard/professionals",
                    }}
                />
            ) : filteredFavorites.length === 0 ? (
                <StandardizedEmptyState
                    icon={Heart}
                    title="No se encontraron resultados"
                    description="No hay profesionales que coincidan con tu búsqueda."
                    action={{
                        label: "Limpiar búsqueda",
                        onClick: () => setSearch(""),
                    }}
                />
            ) : (
                /* Grid of Favorites */
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFavorites.map((fav) => (
                        <Card key={fav.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <Link href={`/professionals/${fav.professional.id}`}>
                                        <Avatar className="h-14 w-14 cursor-pointer hover:opacity-80">
                                            <AvatarImage src={getAvatarUrl(fav.professional.avatar, fav.professional.name)} />
                                            <AvatarFallback>{getInitials(fav.professional.name)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/professionals/${fav.professional.id}`}>
                                            <h3 className="font-semibold line-clamp-2 hover:text-primary cursor-pointer">
                                                {fav.professional.name}
                                            </h3>
                                        </Link>
                                        {fav.professional.profile?.tags && fav.professional.profile.tags.length > 0 && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {fav.professional.profile.tags[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Bio */}
                                {fav.professional.profile?.bio && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {fav.professional.profile.bio}
                                    </p>
                                )}

                                {/* Rating */}
                                {fav.professional.profile?.ratingAvg && (
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <= Math.round(fav.professional.profile!.ratingAvg!)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-gray-200 text-gray-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {fav.professional.profile.ratingAvg.toFixed(1)} ({fav.professional._count?.reviewsReceived || 0})
                                        </span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link href={`/professionals/${fav.professional.id}`}>
                                            Ver Perfil
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemoveFavorite(fav.id, fav.professional.name)}
                                        disabled={deletingId === fav.id}
                                    >
                                        {deletingId === fav.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Stats */}
            {!loading && favorites.length > 0 && (
                <div className="pt-8 border-t">
                    <p className="text-sm text-muted-foreground">
                        Total de favoritos: <strong>{favorites.length}</strong>
                    </p>
                </div>
            )}
        </div>
    )
}
