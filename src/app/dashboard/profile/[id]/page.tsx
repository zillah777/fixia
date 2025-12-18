"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Mail, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils"

interface UserProfile {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    role: string
    profile?: {
        bio?: string
        location?: string
        badges?: string[]
    }
    reviews?: {
        id: string
        score: number
        comment: string
        author: {
            name: string
        }
        createdAt: string
    }[]
}

export default function PublicProfilePage() {
    const params = useParams()
    const router = useRouter()
    const userId = params?.id as string
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch(`/api/users/${userId}/profile`)
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
            } else {
                toast.error("No se pudo cargar el perfil")
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error("Error al cargar el perfil")
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            fetchProfile()
        }
    }, [userId, fetchProfile])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Perfil no encontrado</h2>
                <p className="text-muted-foreground mb-4">El usuario que buscas no existe o no está disponible.</p>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        )
    }

    const averageRating = profile.reviews && profile.reviews.length > 0
        ? profile.reviews.reduce((acc, r) => acc + r.score, 0) / profile.reviews.length
        : 0

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>

            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={getAvatarUrl(profile.avatar, profile.name)} />
                            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                            <div>
                                <h1 className="text-3xl font-bold">{profile.name}</h1>
                                <Badge variant={profile.role === 'PROFESSIONAL' ? 'default' : 'secondary'} className="mt-2">
                                    {profile.role === 'PROFESSIONAL' ? 'Profesional' : 'Cliente'}
                                </Badge>
                            </div>

                            {profile.profile?.bio && (
                                <p className="text-muted-foreground">{profile.profile.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {profile.profile?.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {profile.profile.location}
                                    </div>
                                )}
                                {profile.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {profile.phone}
                                    </div>
                                )}
                                {profile.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {profile.email}
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            {profile.reviews && profile.reviews.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= averageRating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {averageRating.toFixed(1)} ({profile.reviews.length} {profile.reviews.length === 1 ? 'reseña' : 'reseñas'})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reviews */}
            {profile.reviews && profile.reviews.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Reseñas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.reviews.map((review) => (
                            <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold">{review.author.name}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= review.score
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-muted-foreground">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
