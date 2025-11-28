"use client"

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, CheckCircle, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data generator based on ID
const getProfessionalData = (id: string) => {
    return {
        id,
        name: "Juan Pérez",
        role: "Electricista Matriculado",
        rating: 4.9,
        reviewsCount: 124,
        location: "Palermo, CABA",
        image: "/placeholder-user.jpg",
        bio: "Electricista con más de 10 años de experiencia en instalaciones residenciales y comerciales. Especialista en detección de fallas y recableado completo. Trabajo con materiales de primera calidad y ofrezco garantía en todos mis trabajos.",
        verified: true,
        joinedDate: "Enero 2024",
        skills: ["Instalaciones Eléctricas", "Tableros", "Iluminación LED", "Urgencias 24hs", "Certificaciones"],
        reviews: [
            { id: 1, user: "Maria G.", rating: 5, comment: "Excelente trabajo, muy prolijo y puntual. Lo recomiendo.", date: "Hace 2 días" },
            { id: 2, user: "Carlos R.", rating: 5, comment: "Solucionó un problema que otros no pudieron. Muy profesional.", date: "Hace 1 semana" },
            { id: 3, user: "Ana L.", rating: 4, comment: "Buen trabajo, aunque llegó un poco tarde por el tráfico.", date: "Hace 2 semanas" }
        ]
    };
};

function ProfessionalProfile() {
    const params = useParams();
    const id = params.id as string;
    const pro = getProfessionalData(id);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": pro.name,
        "image": pro.image,
        "telephone": "+54 9 11 1234 5678", // Mock phone
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
                                    {pro.rating}
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
                                {pro.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reseñas de Clientes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {pro.reviews.map((review) => (
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
                            ))}
                            <Button variant="outline" className="w-full">Ver todas las reseñas</Button>
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
