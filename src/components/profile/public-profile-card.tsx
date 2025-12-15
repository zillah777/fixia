"use client"

import { useState } from "react"
import { User, Mail, MapPin, Star, Badge as BadgeIcon, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PublicProfileCardProps {
    id: string
    name: string
    avatar?: string | null
    role: "CLIENT" | "PROFESSIONAL"
    bio?: string | null
    email?: string | null
    location?: string | null
    badges?: string[]
    reviewCount?: number
    averageRating?: number
    initialIsFavorite?: boolean
}

export function PublicProfileCard({
    id,
    name,
    avatar,
    role,
    bio,
    email,
    location,
    badges = [],
    reviewCount = 0,
    averageRating = 0,
    initialIsFavorite = false,
}: PublicProfileCardProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const isProfessional = role === "PROFESSIONAL"
    const displayEmail = email && email.includes("@") ? email : null

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isProfessional) {
            toast.error("Solo puedes guardar profesionales")
            return
        }

        setIsLoading(true)
        try {
            if (isFavorite) {
                // Remover de favoritos - para esto necesitaríamos el favoriteId
                // Por ahora solo cambiamos el estado local
                setIsFavorite(false)
                toast.success("Removido de favoritos")
            } else {
                const res = await fetch("/api/favorites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ professionalId: id })
                })

                if (res.ok) {
                    setIsFavorite(true)
                    toast.success(`${name} agregado a favoritos`)
                } else if (res.status === 401) {
                    window.location.href = "/login"
                } else if (res.status === 409) {
                    toast.info("Ya está en tu lista de favoritos")
                    setIsFavorite(true)
                } else {
                    toast.error("Error al agregar a favoritos")
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
            toast.error("Error al actualizar favoritos")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Link href={`/professionals/${id}`} className="h-full block">
            <div className="h-full">
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80">
                                <AvatarImage src={getAvatarUrl(avatar, name)} />
                                <AvatarFallback>{getInitials(name)}</AvatarFallback>
                            </Avatar>
                        <div className="flex gap-2">
                            {isProfessional && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-8 w-8 transition-colors",
                                        isFavorite
                                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                            : "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                    )}
                                    onClick={handleFavoriteClick}
                                    disabled={isLoading}
                                >
                                    <Heart
                                        className="h-4 w-4"
                                        fill={isFavorite ? "currentColor" : "none"}
                                    />
                                </Button>
                            )}
                            <Badge
                                variant={isProfessional ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {isProfessional ? "Profesional" : "Cliente"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Name */}
                    <div>
                        <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{bio}</p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2">
                        {isProfessional && location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate">{location}</span>
                            </div>
                        )}

                        {displayEmail && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="truncate text-xs">{displayEmail}</span>
                            </div>
                        )}
                    </div>

                    {/* Rating (Professionals only) */}
                    {isProfessional && reviewCount > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "h-3.5 w-3.5",
                                            star <= Math.round(averageRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {averageRating.toFixed(1)} ({reviewCount})
                            </span>
                        </div>
                    )}

                    {/* Badges (Professionals only) */}
                    {isProfessional && badges && badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t">
                            {badges.slice(0, 3).map((badge) => (
                                <Badge
                                    key={badge}
                                    variant="outline"
                                    className="text-[10px] px-2 py-0.5"
                                >
                                    <BadgeIcon className="h-2.5 w-2.5 mr-1" />
                                    {badge}
                                </Badge>
                            ))}
                            {badges.length > 3 && (
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                    +{badges.length - 3} más
                                </Badge>
                            )}
                        </div>
                    )}

                </CardContent>
            </Card>
            </div>
        </Link>
    )
}
