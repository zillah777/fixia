"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, ArrowLeft, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import { ProposalForm } from "@/components/proposals/proposal-form"
import { useAuth } from "@/providers/auth-provider"
import { CATEGORIES } from "@/config/categories"
import { Separator } from "@/components/ui/separator"
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils"

export default function OpportunityDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [request, setRequest] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasApplied, setHasApplied] = useState(false)

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await fetch(`/api/requests/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setRequest(data)
                    // Check if current user has already applied
                    if (data.proposals && user) {
                        const application = data.proposals.find((p: any) => p.providerId === user.id)
                        if (application) setHasApplied(true)
                    }
                }
            } catch (error) {
                console.error("Error fetching request details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (params && params.id && user) {
            fetchRequest()
        }
    }, [params, user])

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando detalles...</div>
    }

    if (!request) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Solicitud no encontrada</h1>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        )
    }

    const categoryLabel = CATEGORIES.find(c => c.id === request.categoryId)?.label || "General"

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Back Button */}
            <div>
                <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Oportunidades
                </Button>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-sm border-primary/20 bg-primary/5 text-primary">
                                {categoryLabel}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Publicado el {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{request.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {request.location || "Ubicación remota / A convenir"}
                        </div>
                    </div>
                    <div className="flex flex-col items-end bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Presupuesto Cliente</span>
                        <div className="flex items-baseline gap-1 text-green-700">
                            <span className="text-2xl font-bold">
                                {Number(request.budget) > 0 ? `$${Number(request.budget).toLocaleString()}` : "A Convenir"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Content (Description & Client Info) */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Detalles del Proyecto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="prose max-w-none text-gray-600">
                                <p className="whitespace-pre-wrap leading-relaxed">{request.description}</p>
                            </div>

                            {(() => {
                                let images: string[] = []
                                try {
                                    if (request.images && request.images !== "[]") {
                                        const parsed = JSON.parse(request.images)
                                        if (Array.isArray(parsed)) images = parsed
                                    }
                                } catch (e) {
                                    console.error("Failed to parse request images", e)
                                    images = [] // Fallback
                                }

                                if (images.length === 0) return null

                                return (
                                    <div>
                                        <h3 className="font-semibold mb-3">Imágenes Adjuntas</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {images.map((img: string, i: number) => (
                                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                                    <img src={img} alt={`Adjunto ${i + 1}`} className="object-cover w-full h-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })()}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Sobre el Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={getAvatarUrl(request.client.avatar, request.client.name)} />
                                    <AvatarFallback>{getInitials(request.client.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{request.client.name}</p>
                                    <p className="text-sm text-muted-foreground">Miembro de Fixia</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (Apply Form) */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {hasApplied ? (
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-6 text-center space-y-3">
                                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-green-800">¡Ya aplicaste!</h3>
                                    <p className="text-sm text-green-700">
                                        Tu propuesta ha sido enviada. Te notificaremos si el cliente te selecciona.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <ProposalForm requestId={request.id} onSuccess={() => setHasApplied(true)} />
                        )}

                        <Card className="bg-blue-50/50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="text-sm text-blue-800">Consejos para tu propuesta</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-blue-700 space-y-2">
                                <p>• Sé claro y conciso con tu presupuesto.</p>
                                <p>• Menciona experiencia relevante similar a este proyecto.</p>
                                <p>• Transmite confianza y profesionalismo.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
