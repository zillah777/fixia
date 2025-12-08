"use client"

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Calendar, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function ClientProfile() {
    const params = useParams();
    const id = params.id as string;
    const [client, setClient] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await fetch(`/api/clients/${id}`)
                if (!res.ok) throw new Error("Client not found")
                const data = await res.json()
                setClient(data)
            } catch (err) {
                setError("No se pudo cargar el perfil del cliente.")
            } finally {
                setLoading(false)
            }
        }
        fetchClient()
    }, [id])

    if (loading) return <div className="container mx-auto py-12 text-center">Cargando perfil...</div>
    if (error || !client) return <div className="container mx-auto py-12 text-center text-red-500">{error || "Cliente no encontrado"}</div>

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg mb-4">
                                <AvatarImage src={client.image} />
                                <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>

                            <h1 className="text-2xl font-bold mb-1">{client.name}</h1>
                            <p className="text-muted-foreground mb-4">Cliente de Fixia</p>

                            <div className="space-y-4 text-left border-t pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Miembro desde {client.joinedDate}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{client.stats.requestsMade}</div>
                                    <div className="text-xs text-muted-foreground">Solicitudes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">{client.stats.activeRequests}</div>
                                    <div className="text-xs text-muted-foreground">Activas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">{client.stats.reviewsGiven}</div>
                                    <div className="text-xs text-muted-foreground">Reseñas</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Activity Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Resumen de Actividad
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Solicitudes Realizadas</p>
                                        <p className="text-sm text-muted-foreground">Total de servicios solicitados</p>
                                    </div>
                                    <Badge variant="secondary" className="text-lg px-4 py-2">
                                        {client.stats.requestsMade}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Reseñas Publicadas</p>
                                        <p className="text-sm text-muted-foreground">Opiniones sobre profesionales</p>
                                    </div>
                                    <Badge variant="secondary" className="text-lg px-4 py-2">
                                        {client.stats.reviewsGiven}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reviews Given */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Reseñas Publicadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {client.reviews && client.reviews.length > 0 ? client.reviews.map((review: any) => (
                                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                                    <div className="flex items-start gap-4 mb-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={review.professionalImage} />
                                            <AvatarFallback>{review.professionalName?.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold">{review.professionalName}</p>
                                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-muted-foreground py-8">
                                    Este cliente aún no ha publicado reseñas.
                                </div>
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
            <ClientProfile />
        </Suspense>
    )
}
