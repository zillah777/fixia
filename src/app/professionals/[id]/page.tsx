"use client"

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, CheckCircle, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
        "telephone": "+54 9 11 1234 5678", // Still hardcoded as we don't expose phone publicly usually
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
                                    <AvatarImage src={pro.image} />
                                    <AvatarFallback>{pro.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                {pro.verified && (
                                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm" title="Verificado">
                                        <CheckCircle className="h-6 w-6 text-blue-500 fill-blue-100" />
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
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span>Identidad Verificada</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link href={`/dashboard/requests/create?proId=${pro.id}`}>
                                    <Button className="w-full" size="lg">Contactar</Button>
                                </Link>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Debes registrarte para contactar.
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
                            <p className="text-muted-foreground leading-relaxed">
                                {pro.bio}
                            </p>
                        </CardContent>
                    </Card>

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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {pro.portfolio.map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                                            <img
                                                src={img}
                                                alt={`Trabajo ${i + 1} de ${pro.name}`}
                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                            />
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
                                <div className="text-center text-muted-foreground">Aún no hay reseñas.</div>
                            )}
                            {pro.reviews && pro.reviews.length > 0 && (
                                <Button variant="outline" className="w-full">Ver todas las reseñas</Button>
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
