"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Clock, Share2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProProposalCard } from "@/components/proposals/pro-proposal-card"
import { MatchCelebration } from "@/components/proposals/match-celebration"
import { ReviewForm } from "@/components/reviews/review-form"
import { toast } from "sonner"

import { useParams } from "next/navigation"

export default function RequestDetailPage() {
    const params = useParams()
    const [request, setRequest] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCelebrationOpen, setIsCelebrationOpen] = useState(false)
    const [selectedPro, setSelectedPro] = useState<any>(null)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [status, setStatus] = useState("OPEN")

    // Fetch Request Data
    useState(() => {
        const fetchRequest = async () => {
            try {
                const res = await fetch(`/api/requests/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setRequest(data)
                    setStatus(data.status)
                } else {
                    toast.error("No se pudo cargar la solicitud")
                }
            } catch (error) {
                console.error("Error fetching request:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRequest()
    })

    const handleAcceptProposal = async (proposal: any) => {
        try {
            const res = await fetch("/api/matches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: request.id,
                    providerId: proposal.provider.id, // Ensure we have this from the map
                    proposalId: proposal.id
                })
            })

            if (!res.ok) throw new Error("Failed to accept proposal")

            setSelectedPro(proposal)
            setIsCelebrationOpen(true)
            setStatus("MATCHED")
            toast.success("¡Propuesta aceptada!")

            // Refresh request data to get the new match
            const updatedReq = await fetch(`/api/requests/${params.id}`).then(r => r.json())
            setRequest(updatedReq)

        } catch (error) {
            console.error("Error accepting proposal:", error)
            toast.error("Error al aceptar la propuesta")
        }
    }

    const handleCompleteJob = () => {
        setStatus("COMPLETED")
        setIsReviewOpen(true)
        toast.success("¡Trabajo marcado como completado!")
    }

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!request.match) {
            toast.error("No hay un trabajo activo para calificar")
            return
        }

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId: request.match.id,
                    targetId: request.match.providerId,
                    score: rating,
                    comment
                })
            })

            if (!res.ok) throw new Error("Failed to submit review")

            toast.success("¡Gracias por tu calificación!")
            setIsReviewOpen(false)
        } catch (error) {
            console.error("Error submitting review:", error)
            toast.error("Error al enviar la calificación")
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
    }

    if (!request) {
        return <div className="flex justify-center items-center min-h-screen">Solicitud no encontrada</div>
    }

    // Map proposals to UI format
    const formattedProposals = request.proposals?.map((p: any) => ({
        id: p.id,
        provider: p.provider, // Keep the provider object for logic
        proName: p.provider.name || "Profesional",
        proAvatar: `https://ui-avatars.com/api/?name=${p.provider.name}&background=random`,
        rating: p.provider.profile?.ratingAvg || 0,
        reviewsCount: 0, // Need to fetch this or include in query
        price: Number(p.price),
        message: p.message,
        badges: (p.provider.profile?.badges || []) as any,
        isElite: (p.provider.profile?.trustScore || 0) > 80,
        timeEstimate: "A coordinar",
        isVerified: p.provider.profile?.badges?.includes("VERIFIED")
    })) || []

    return (
        <div className="space-y-8 pb-20">
            {/* Review Form Dialog */}
            <ReviewForm
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                proName={request?.match?.provider?.name || selectedPro?.proName || "Profesional"}
                onSubmit={handleReviewSubmit}
            />

            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/requests">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Status */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                {request.category || "General"}
                            </Badge>
                            <Badge variant="outline" className={
                                status === 'OPEN' ? 'text-green-600 border-green-200 bg-green-50' :
                                    status === 'COMPLETED' ? 'text-gray-600 border-gray-200 bg-gray-50' : ''
                            }>
                                {status === 'OPEN' ? 'Abierto a Propuestas' :
                                    status === 'COMPLETED' ? 'Completado' : status}
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            {request.title}
                        </h1>
                    </div>

                    {/* Image Gallery */}
                    {request.images && request.images.length > 0 ? (
                        <div className={`grid gap-4 ${request.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {request.images.map((img: string, i: number) => (
                                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-gray-100 relative group">
                                    <img
                                        src={img}
                                        alt={`Foto ${i + 1} `}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/20 rounded-2xl p-8 text-center text-muted-foreground">
                            No hay imágenes adjuntas a esta solicitud.
                        </div>
                    )}

                    {/* Description */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Descripción del Problema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">
                                {request.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Proposals Section */}
                    <div className="pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Propuestas ({formattedProposals.length})</h2>
                            <span className="text-sm text-muted-foreground">Ordenado por: Recomendado</span>
                        </div>

                        <div className="space-y-6">
                            {formattedProposals.length > 0 ? (
                                formattedProposals.map((proposal: any) => (
                                    <ProProposalCard
                                        key={proposal.id}
                                        data={proposal}
                                        onAccept={() => handleAcceptProposal(proposal)}
                                        onViewProfile={() => console.log("View Profile", proposal.id)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                                    No hay propuestas todavía.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-lg bg-black text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <CardContent className="p-6 space-y-6 relative z-10">
                            <div>
                                <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Presupuesto Estimado</p>
                                <div className="text-3xl font-bold">
                                    ${Number(request.budget || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-white/80 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Ubicación</p>
                                        <p className="text-sm text-white/70">{request.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-white/80 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Fecha de Creación</p>
                                        <p className="text-sm text-white/70">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-white/80 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Estado</p>
                                        <Badge variant="secondary" className="mt-1 bg-white/20 text-white hover:bg-white/30 border-none">
                                            {status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {status === 'OPEN' ? (
                                <Button className="w-full bg-white text-black hover:bg-white/90 font-bold">
                                    Editar Solicitud
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                                    onClick={handleCompleteJob}
                                    disabled={status === 'COMPLETED'}
                                >
                                    {status === 'COMPLETED' ? 'Trabajo Completado' : 'Marcar como Completado'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-blue-50/50 border-blue-100">
                        <CardContent className="p-4 flex gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 h-fit">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-blue-900">Consejo Pro</h4>
                                <p className="text-xs text-blue-700/80 mt-1">
                                    Agregar más fotos del problema ayuda a los profesionales a darte un presupuesto más exacto.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

