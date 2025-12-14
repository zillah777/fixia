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

function ProfessionalProfile() {
    const params = useParams();
    const id = params.id as string;
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
        <div className="container mx-auto px-4 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="relative inline-block mb-4">
                                <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg">
                                    <AvatarImage src={getAvatarUrl(pro.image, pro.name)} />
                                    <AvatarFallback>{getInitials(pro.name)}</AvatarFallback>
                                </Avatar>
                                {pro.verified && (
                                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 shadow-md border-2 border-white" title="Identidad Verificada">
                                        <CheckCircle className="h-5 w-5 text-white fill-none" />
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold mb-1">{pro.name}</h1>
                            <p className="text-primary font-medium mb-4">{pro.role}</p>

                            <div className="flex items-center justify-center gap-2 mb-6">
                                <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold dark:bg-yellow-900 dark:text-yellow-200">
                                    <Star className="h-4 w-4 fill-yellow-600 text-yellow-600 mr-1" />
                                    {Number(pro.rating).toFixed(1)}
                                </div>
                                <span className="text-muted-foreground text-sm">({pro.reviewsCount} reseñas)</span>
                            </div>

                            <div className="space-y-4 text-left border-t pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{pro.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Miembro desde {pro.joinedDate}</span>
                                </div>
                                {pro.verified ? (
                                    <div className="flex items-center gap-3 text-sm text-green-600 font-medium">
                                        <Shield className="h-4 w-4" />
                                        <span>Identidad Verificada</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>Identidad No Verificada</span>
                                    </div>
                                )}
                            </div>

                            {/* Badges Display */}
                            {pro.badges && pro.badges.length > 0 && (
                                <div className="mt-6 border-t pt-4 text-left">
                                    <h4 className="text-sm font-semibold mb-2">Insignias</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {pro.badges.map((badge: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-xs bg-muted/50 border-primary/20 text-primary">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8">
                                {pro.isFavorite ? (
                                    <Button
                                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                        variant="outline"
                                        size="lg"
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
                                        <Heart className="mr-2 h-5 w-5 fill-current" />
                                        Quitar de Favoritos
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        size="lg"
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
                                        <Heart className="mr-2 h-5 w-5" />
                                        Agregar a Favoritos
                                    </Button>
                                )}
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Guarda este perfil para contactarlo más tarde.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Bio */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre mí</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {pro.bio}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    {pro.services && pro.services.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Mis Servicios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pro.services.map((service: any) => (
                                    <div key={service.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{service.title}</h3>
                                            <span className="font-bold text-primary">
                                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(service.price)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                                        {service.tags && service.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {service.tags.map((tag: string, idx: number) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Especialidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {pro.skills && pro.skills.map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Portfolio */}
                    {pro.portfolio && pro.portfolio.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Portafolio de Trabajos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {pro.portfolio.map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-zoom-in">
                                            <img
                                                src={img}
                                                alt={`Trabajo ${i + 1} de ${pro.name}`}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reseñas de Clientes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {pro.reviews && pro.reviews.length > 0 ? pro.reviews.map((review: any) => (
                                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold">{review.user}</div>
                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        "{review.comment}"
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center text-muted-foreground py-4">Aún no hay reseñas.</div>
                            )}
                        </CardContent>
                    </Card>
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
