"use client"

export const dynamic = "force-dynamic"

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, CheckCircle, Calendar, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils";
import { TrustBadgesGroup } from "@/components/ui/trust-badges";

function ProfessionalProfile() {
    const params = useParams();
    const id = params?.id as string;
    const [pro, setPro] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        const fetchPro = async () => {
            try {
                const res = await fetch(`/api/professionals/${id}`)
                if (!res.ok) throw new Error("Professional not found")
                const data = await res.json()
                setPro(data)
            } catch (err) {
                setError("No se pudo cargar el perfil del profesional.")
            } finally {
                setLoading(false)
            }
        }
        fetchPro()
    }, [id])

    if (loading) return <div className="container mx-auto py-12 text-center">Cargando perfil...</div>
    if (error || !pro) return <div className="container mx-auto py-12 text-center text-red-500">{error || "Profesional no encontrado"}</div>

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": pro.name,
        "image": pro.image,
        "telephone": "+54 9 11 1234 5678", // Placeholder
        "address": {
            "@type": "PostalAddress",
            "streetAddress": pro.location,
            "addressLocality": "Buenos Aires",
            "addressCountry": "AR"
        },
        "priceRange": "$$",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": pro.rating,
            "reviewCount": pro.reviewsCount
        }
    };

    return (
        <div className="min-h-screen bg-stone-50/50 dark:bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero / Banner with Gradient */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/90 to-primary/70 relative">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <CardContent className="pt-0 px-0 pb-6 text-center">
                                <div className="bg-background pt-8 pb-4 px-6 rounded-t-xl relative">
                                    <div className="relative inline-block">
                                        <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-xl">
                                            <AvatarImage src={getAvatarUrl(pro.image, pro.name)} className="object-cover" />
                                            <AvatarFallback>{getInitials(pro.name)}</AvatarFallback>
                                        </Avatar>
                                        {pro.verified && (
                                            <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1.5 shadow-sm ring-4 ring-background" title="Identidad Verificada">
                                                <CheckCircle className="h-5 w-5 text-white fill-none" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h1 className="text-2xl font-bold text-foreground">{pro.name}</h1>
                                        <Badge variant="secondary" className="mt-2 font-medium text-primary bg-primary/10 hover:bg-primary/20">
                                            {pro.role}
                                        </Badge>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-center gap-6 mt-6 pb-2">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 font-bold text-lg">
                                                <Star className={`h-5 w-5 ${Number(pro.rating) > 0 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                                <span>{Number(pro.rating) > 0 ? Number(pro.rating).toFixed(1) : "N/A"}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Rating</p>
                                        </div>
                                        <div className="h-8 w-px bg-border" />
                                        <div className="text-center">
                                            <div className="font-bold text-lg">{pro.reviewsCount}</div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Reseñas</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 space-y-4 pt-2">
                                    <div className="flex items-center gap-3 text-sm text-left p-3 rounded-lg bg-stone-50 dark:bg-muted/50">
                                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Ubicación</p>
                                            <p className="font-medium">{pro.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-left p-3 rounded-lg bg-stone-50 dark:bg-muted/50">
                                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Miembro desde</p>
                                            <p className="font-medium">{pro.joinedDate}</p>
                                        </div>
                                    </div>

                                    {pro.badges && pro.badges.length > 0 && (
                                        <div className="pt-2 text-left">
                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reconocimientos</h4>
                                            <TrustBadgesGroup badges={pro.badges} size="sm" showLabels={true} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 mt-2">
                                    {pro.isFavorite ? (
                                        <Button
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300"
                                            variant="outline"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(`/api/favorites/${pro.favoriteId}`, {
                                                        method: 'DELETE'
                                                    })
                                                    if (res.ok) {
                                                        setPro({ ...pro, isFavorite: false, favoriteId: null })
                                                    }
                                                } catch (err) {
                                                    console.error("Error removing favorite", err)
                                                }
                                            }}
                                        >
                                            <Heart className="mr-2 h-4 w-4 fill-current" />
                                            Quitar de Favoritos
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full shadow-md hover:shadow-lg transition-all"
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch('/api/favorites', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ professionalId: pro.id })
                                                    })
                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        setPro({ ...pro, isFavorite: true, favoriteId: data.id })
                                                    } else if (res.status === 401) {
                                                        window.location.href = '/login'
                                                    }
                                                } catch (err) {
                                                    console.error("Error adding favorite", err)
                                                }
                                            }}
                                        >
                                            <Heart className="mr-2 h-4 w-4" />
                                            Agregar a Favoritos
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Bio Section */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Sobre mí
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                                    {pro.bio || "Este profesional aún no ha agregado una descripción."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Services Section */}
                        {pro.services && pro.services.length > 0 && (
                            <Card className="border-none shadow-sm">
                                <CardHeader className="pb-3 border-b border-border/40">
                                    <CardTitle className="text-xl">Mis Servicios</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    {pro.services.map((service: any) => (
                                        <div key={service.id} className="group border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 bg-card">
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                                                <Badge variant="secondary" className="font-bold text-primary bg-primary/10 border-0">
                                                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(service.price)}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{service.description}</p>
                                            {service.tags && service.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {service.tags.map((tag: string, idx: number) => (
                                                        <span key={idx} className="text-xs px-2 py-1 rounded-md bg-stone-100 dark:bg-muted text-muted-foreground font-medium">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews Section */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl">Reseñas de Clientes</CardTitle>
                                {pro.reviewsCount > 0 && (
                                    <Badge variant="outline" className="font-normal text-muted-foreground">
                                        {pro.reviewsCount} opiniones
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="pt-6">
                                {pro.reviews && pro.reviews.length > 0 ? (
                                    <div className="grid gap-6">
                                        {pro.reviews.map((review: any) => (
                                            <div key={review.id} className="bg-stone-50/50 dark:bg-muted/20 p-5 rounded-2xl">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(review.user)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-semibold text-sm">{review.user}</div>
                                                            <div className="text-xs text-muted-foreground">{review.date}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex bg-white dark:bg-card px-2 py-1 rounded-full shadow-sm border">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm italic relative pl-4 border-l-2 border-primary/20">
                                                    &quot;{review.comment}&quot;
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-muted mb-3">
                                            <Star className="h-6 w-6 text-muted-foreground/40" />
                                        </div>
                                        <h3 className="text-sm font-medium text-foreground">Sin reseñas todavía</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Este profesional aún no ha recibido calificaciones.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function Page() {
    return (
        <Suspense fallback={<div>Cargando perfil...</div>}>
            <ProfessionalProfile />
        </Suspense>
    )
}
