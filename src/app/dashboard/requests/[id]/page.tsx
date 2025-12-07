"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Clock, Share2, MoreVertical, Trash2, Check, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ProProposalCard } from "@/components/proposals/pro-proposal-card"
import { MatchCelebration } from "@/components/proposals/match-celebration"
import { ReviewForm } from "@/components/reviews/review-form"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"

export default function RequestDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [request, setRequest] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCelebrationOpen, setIsCelebrationOpen] = useState(false)
    const [selectedPro, setSelectedPro] = useState<any>(null)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [status, setStatus] = useState("OPEN")

    // Check if current user is the invited professional
    const [isInvitedPro, setIsInvitedPro] = useState(false)
    const [myProposalId, setMyProposalId] = useState<string | null>(null)

    // Fetch Request Data
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await fetch(`/api/requests/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setRequest(data)
                    setStatus(data.status)

                    // Check if I am the invited professional
                    // logic depends on how API returns data. 
                    // Assuming API returns `isInvited` or searching in proposals if user is Pro.
                    // For now, let's assume the API returns a 'myProposal' field if the user is a provider involved.
                    if (data.myProposal && data.myProposal.status === "PENDING_PRO_APPROVAL") {
                        setIsInvitedPro(true)
                        setMyProposalId(data.myProposal.id)
                    }
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
    }, [params.id])

    const handleAcceptHire = async () => {
        try {
            const res = await fetch("/api/matches/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: request.id
                })
            })

            const result = await res.json()

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("Acción bloqueada", { description: result.error })
                    return
                }
                throw new Error(result.error || "Failed to accept")
            }

            setStatus("IN_PROGRESS") // Or "MATCHED"
            toast.success("¡Has aceptado el trabajo!", {
                description: "Se ha creado el match. Ahora puedes ver los datos del cliente."
            })
            router.refresh()
            // Optionally redirect to match detail
            setTimeout(() => router.push(`/dashboard/matches/${result.matchId}`), 1000)

        } catch (error) {
            console.error(error)
            toast.error("Error al aceptar el trabajo")
        }
    }

    const handleRejectHire = async () => {
        // Implement reject logic (update proposal to REJECTED)
        try {
            const res = await fetch(`/api/proposals/${myProposalId}/reject`, { method: "POST" })
            if (res.ok) {
                toast.success("Has rechazado la propuesta")
                router.push("/dashboard/opportunities")
            }
        } catch (e) {
            toast.error("Error al rechazar")
        }
    }

    // ... (Existing handlers: handleAcceptProposal for Client, handleCompleteJob, etc)
    const handleAcceptProposal = async (proposal: any) => {
        // ... existing implementation for Client accepting Pro's proposal
    }
    const handleCompleteJob = async () => { /* ... existing ... */ }
    const handleReviewSubmit = async (rating: number, comment: string) => { /* ... existing ... */ }
    const handleShare = async () => { /* ... existing ... */ }
    const handleDelete = async () => { /* ... existing ... */ }


    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
    }

    if (!request) {
        return <div className="flex justify-center items-center min-h-screen">Solicitud no encontrada</div>
    }

    // Existing formatting logic
    const formattedProposals = request.proposals?.map((p: any) => ({
        id: p.id,
        provider: p.provider,
        proName: p.provider.name || "Profesional",
        proAvatar: `https://ui-avatars.com/api/?name=${p.provider.name}&background=random`,
        rating: p.provider.profile?.ratingAvg || 0,
        reviewsCount: 0,
        price: Number(p.price),
        message: p.message,
        badges: (p.provider.profile?.badges || []) as any,
        isVerified: p.provider.profile?.badges?.includes("VERIFIED")
    })) || []

    return (
        <div className="space-y-8 pb-20">
            {/* Review Form - Existing */}
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
                {/* ... existing dropdown ... */}
            </div>

            {/* If I am the Invited Professional */}
            {isInvitedPro && status === "OPEN" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <Check className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900">¡Te han enviado una propuesta directa!</h3>
                                <p className="text-blue-700">
                                    El cliente quiere contratarte por <strong>${request.budget}</strong>.
                                    Al aceptar, se creará el match y podrás ver sus datos de contacto.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button variant="outline" className="flex-1 md:flex-none border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={handleRejectHire}>
                                Rechazar
                            </Button>
                            <Button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAcceptHire}>
                                Aceptar Trabajo
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Request Details (Existing) */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                {request.category || "General"}
                            </Badge>
                            {/* ... checks for status ... */}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                            {request.title}
                        </h1>
                    </div>

                    {/* Image Gallery (Existing) */}
                    {request.images && request.images.length > 0 ? (
                        <div className={`grid gap-4 ${request.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {request.images.map((img: string, i: number) => (
                                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-gray-100 relative group">
                                    <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/20 rounded-2xl p-8 text-center text-muted-foreground">
                            No hay imágenes adjuntas.
                        </div>
                    )}

                    {/* Description (Existing) */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed">{request.description}</p>
                        </CardContent>
                    </Card>

                    {/* Proposals Section: Hide if I am invited Pro? Or show only mine? */}
                    {!isInvitedPro && (
                        <div className="pt-8">
                            {/* ... existing proposals list code ... */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Propuestas ({formattedProposals.length})</h2>
                            </div>
                            {/* ... map proposals ... */}
                        </div>
                    )}
                </div>

                {/* Sidebar Info (Existing) */}
                <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                    {/* ... budget card ... */}
                    <Card className="border-none shadow-lg bg-black text-white overflow-hidden relative">
                        <CardContent className="p-6 space-y-6 relative z-10">
                            <div>
                                <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Presupuesto</p>
                                <div className="text-3xl font-bold">${Number(request.budget || 0).toLocaleString()}</div>
                            </div>
                            {/* ... location date state ... */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-white/80 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Ubicación</p>
                                        <p className="text-sm text-white/70">{request.location}</p>
                                    </div>
                                </div>
                                {/* ... etc ... */}
                            </div>

                            {/* Actions Buttons Logic */}
                            {/* If Client: Edit / Mark Complete */}
                            {/* If Invited Pro: Actions are in the top banner already, or repeat here? */}

                            {!isInvitedPro && (
                                status === 'OPEN' ? (
                                    <Button className="w-full bg-white text-black hover:bg-white/90 font-bold">
                                        Editar Solicitud
                                    </Button>
                                ) : (
                                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold" onClick={handleCompleteJob} disabled={status === 'COMPLETED'}>
                                        {status === 'COMPLETED' ? 'Trabajo Completado' : 'Marcar como Completado'}
                                    </Button>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
