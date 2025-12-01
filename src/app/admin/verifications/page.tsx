"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function VerificationsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [rejectDialog, setRejectDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })
    const [rejectReason, setRejectReason] = useState("")

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/verifications")
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch (error) {
            console.error("Error fetching requests:", error)
            toast.error("Error al cargar solicitudes")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (id: string, action: "APPROVE" | "REJECT", reason?: string) => {
        setProcessingId(id)
        try {
            const res = await fetch("/api/admin/verifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action, reason })
            })

            if (res.ok) {
                toast.success(action === "APPROVE" ? "Solicitud aprobada" : "Solicitud rechazada")
                setRequests(prev => prev.filter(r => r.id !== id))
            } else {
                toast.error("Error al procesar la solicitud")
            }
        } catch (error) {
            console.error("Error processing request:", error)
            toast.error("Error de conexión")
        } finally {
            setProcessingId(null)
            setRejectDialog({ isOpen: false, id: null })
            setRejectReason("")
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Cargando solicitudes...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Centro de Verificaciones</h2>
                <p className="text-muted-foreground">Revisa y valida la identidad de los usuarios.</p>
            </div>

            {requests.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Check className="h-12 w-12 mb-4 text-green-500" />
                        <p>¡Todo al día! No hay solicitudes pendientes.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {requests.map((req) => (
                        <Card key={req.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{req.user.name}</CardTitle>
                                        <CardDescription>{req.user.email}</CardDescription>
                                    </div>
                                    <Badge variant="outline">{new Date(req.createdAt).toLocaleDateString()}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="border rounded-lg p-4 bg-muted/50">
                                        <p className="text-sm font-medium mb-2">Documento (Frente)</p>
                                        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center relative overflow-hidden group">
                                            {/* In a real app, use <Image> with the Cloudinary URL */}
                                            <span className="text-xs text-muted-foreground">Vista Previa</span>
                                            <a href={req.idFront} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="text-white h-6 w-6" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-4 bg-muted/50">
                                        <p className="text-sm font-medium mb-2">Documento (Dorso)</p>
                                        <div className="aspect-video bg-gray-200 rounded flex items-center justify-center relative overflow-hidden group">
                                            <span className="text-xs text-muted-foreground">Vista Previa</span>
                                            <a href={req.idBack} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="text-white h-6 w-6" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="destructive"
                                        onClick={() => setRejectDialog({ isOpen: true, id: req.id })}
                                        disabled={!!processingId}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Rechazar
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAction(req.id, "APPROVE")}
                                        disabled={!!processingId}
                                    >
                                        {processingId === req.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                        Aprobar Verificación
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={rejectDialog.isOpen} onOpenChange={(open) => !open && setRejectDialog({ isOpen: false, id: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rechazar Solicitud</DialogTitle>
                        <DialogDescription>
                            Por favor, indica el motivo del rechazo para notificar al usuario.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Ej: La foto del documento está borrosa..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialog({ isOpen: false, id: null })}>Cancelar</Button>
                        <Button
                            variant="destructive"
                            onClick={() => rejectDialog.id && handleAction(rejectDialog.id, "REJECT", rejectReason)}
                            disabled={!rejectReason.trim() || !!processingId}
                        >
                            Confirmar Rechazo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
