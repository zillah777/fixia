"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, DollarSign, CheckCircle2, MessageSquare, Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Mock data for a specific request
const requestData = {
    id: "1",
    title: "Instalación de Ventilador de Techo",
    status: "OPEN", // OPEN, MATCHED, COMPLETED
    category: "Electricidad",
    location: "Palermo, CABA",
    date: "Para mañana",
    budget: 15000,
    description: "Necesito instalar un ventilador de techo en una habitación. El techo es de losa. Ya tengo el ventilador.",
    images: [],
    proposals: [
        {
            id: "p1",
            provider: {
                name: "Juan Pérez",
                rating: 4.8,
                reviews: 124,
                image: "/placeholder-avatar.jpg",
                verified: true
            },
            price: 18000,
            message: "Hola! Soy electricista matriculado. Puedo realizar el trabajo mañana por la tarde. El precio incluye materiales de fijación.",
            createdAt: "Hace 2 horas"
        },
        {
            id: "p2",
            provider: {
                name: "Carlos Gomez",
                rating: 4.5,
                reviews: 45,
                image: "/placeholder-avatar-2.jpg",
                verified: false
            },
            price: 15000,
            message: "Buenas, tengo disponibilidad inmediata. Saludos.",
            createdAt: "Hace 5 horas"
        }
    ]
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [isAccepting, setIsAccepting] = useState<string | null>(null)

    const handleAcceptProposal = async (proposalId: string) => {
        setIsAccepting(proposalId)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("¡Propuesta aceptada! Se ha creado un match.")
            router.push("/dashboard/matches")
        } catch (error) {
            toast.error("Error al aceptar propuesta", {
                description: "No se pudo procesar la acción. Intenta nuevamente."
            })
        } finally {
            setIsAccepting(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Detalle de Solicitud</h2>
                <Badge variant={requestData.status === "OPEN" ? "default" : "secondary"}>
                    {requestData.status === "OPEN" ? "Abierta" : "Cerrada"}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Request Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{requestData.title}</CardTitle>
                                    <CardDescription className="mt-1">{requestData.category}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">${requestData.budget.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Presupuesto estimado</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">{requestData.description}</p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{requestData.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{requestData.date}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h3 className="text-xl font-semibold">Propuestas Recibidas ({requestData.proposals.length})</h3>

                    <div className="space-y-4">
                        {requestData.proposals.map((proposal) => (
                            <Card key={proposal.id} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Provider Info */}
                                        <div className="flex items-start gap-4 min-w-[200px]">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={proposal.provider.image} />
                                                <AvatarFallback>{proposal.provider.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold flex items-center gap-1">
                                                    {proposal.provider.name}
                                                    {proposal.provider.verified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-yellow-500">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <span>{proposal.provider.rating}</span>
                                                    <span className="text-muted-foreground">({proposal.provider.reviews})</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">{proposal.createdAt}</div>
                                            </div>
                                        </div>

                                        {/* Proposal Details */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="text-lg font-bold">${proposal.price.toLocaleString()}</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                                "{proposal.message}"
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col justify-center gap-2 min-w-[120px]">
                                            <Button
                                                onClick={() => handleAcceptProposal(proposal.id)}
                                                disabled={!!isAccepting}
                                            >
                                                {isAccepting === proposal.id ? "Procesando..." : "Aceptar"}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Chat
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Tips */}
                <div className="space-y-6">
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-400 text-lg">Consejos de Seguridad</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2 text-blue-900 dark:text-blue-200">
                            <p>• No compartas tu número de teléfono hasta aceptar una propuesta.</p>
                            <p>• Revisa las calificaciones y reseñas del profesional.</p>
                            <p>• Realiza todos los pagos a través de la plataforma para estar protegido.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
