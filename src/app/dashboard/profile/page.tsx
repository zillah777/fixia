"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Star, Shield, Award, CheckCircle2, AlertCircle, Edit } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [completeness, setCompleteness] = useState(0)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/users/profile")
                if (res.ok) {
                    const data = await res.json()
                    setProfile(data)

                    // Calculate Completeness
                    let score = 0
                    let total = 0
                    const fields = [
                        data.name,
                        data.profile?.bio,
                        data.profile?.locationLat,
                        data.dni,
                        data.phone,
                        data.profile?.socialLinks
                    ]

                    fields.forEach(f => {
                        total++
                        if (f) score++
                    })

                    setCompleteness(total > 0 ? Math.round((score / total) * 100) : 0)
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        fetchProfile()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-green-500 h-6 w-6 rounded-full border-4 border-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-muted-foreground">Miembro desde {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Buenos Aires, Argentina</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Link href="/dashboard/settings">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Completeness Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Completitud del Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{completeness}% Completado</span>
                                    <span className="text-muted-foreground">{completeness < 100 ? "Falta poco" : "¡Excelente!"}</span>
                                </div>
                                <Progress value={completeness} className="h-2" />
                            </div>
                            {completeness < 100 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Te falta agregar:</p>
                                    <ul className="space-y-1">
                                        {!profile?.dni && (
                                            <li className="flex items-center text-xs text-red-500">
                                                <AlertCircle className="mr-2 h-3 w-3" />
                                                Verificar Identidad
                                            </li>
                                        )}
                                        {!profile?.profile?.socialLinks && (
                                            <li className="flex items-center text-xs text-yellow-600">
                                                <AlertCircle className="mr-2 h-3 w-3" />
                                                Agregar Redes Sociales
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Trust Badges */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Insignias de Confianza</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email Verificado</p>
                                    <p className="text-xs text-muted-foreground">Tu correo está confirmado</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <Shield className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Identidad No Verificada</p>
                                    <p className="text-xs text-muted-foreground">Sube tu DNI para verificar</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Bio */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre Mí</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {profile?.profile?.bio || "No has escrito una biografía todavía."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-xs text-muted-foreground mt-1">Proyectos</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold">{profile?.profile?.ratingAvg || 0}</div>
                                <div className="text-xs text-muted-foreground mt-1">Reseñas</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-xs text-muted-foreground mt-1">Favoritos</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
