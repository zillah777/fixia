"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    CheckCircle2,
    XCircle,
    Clock,
    Award,
    ExternalLink,
    User as UserIcon,
    Loader2,
    Calendar,
    Hash
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Certification {
    id: string
    userId: string
    title: string
    issuingBody: string
    issueDate: string
    certificateImage: string
    certificateNumber?: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    adminNote?: string
    createdAt: string
    user: {
        id: string
        name: string
        email: string
        role: string
    }
}

export default function AdminCertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState<string | null>(null)
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})

    const fetchCertifications = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/certifications?status=PENDING")
            if (res.ok) {
                const data = await res.json()
                setCertifications(data.certifications)
            } else {
                toast.error("Error al cargar certificaciones")
            }
        } catch (error) {
            console.error("Fetch error:", error)
            toast.error("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCertifications()
    }, [])

    const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        const adminNote = adminNotes[id] || ""

        if (status === "REJECTED" && !adminNote) {
            toast.error("Debes incluir una nota para rechazar la certificación")
            return
        }

        setIsProcessing(id)
        try {
            const res = await fetch(`/api/admin/certifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNote })
            })

            if (res.ok) {
                toast.success(`Certificación ${status === "APPROVED" ? "aprobada" : "rechazada"}`)
                setCertifications(certifications.filter(c => c.id !== id))
            } else {
                const error = await res.json()
                toast.error(error.error || "Error al actualizar estado")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsProcessing(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Certificaciones Pendientes</h1>
                    <p className="text-muted-foreground text-sm">
                        Revisa y aprueba los títulos profesionales de los usuarios.
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                    {certifications.length} pendientes
                </Badge>
            </div>

            {certifications.length === 0 ? (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="font-semibold text-lg">No hay solicitudes pendientes</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            Todas las certificaciones han sido procesadas o no se han enviado nuevas solicitudes.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {certifications.map((cert) => (
                        <Card key={cert.id} className="overflow-hidden flex flex-col border-primary/10">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Award className="h-5 w-5 text-primary" />
                                            {cert.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 font-medium text-foreground/80">
                                            {cert.issuingBody}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary">PENDIENTE</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <div className="grid md:grid-cols-2">
                                    {/* Image Section */}
                                    <div className="relative aspect-auto min-h-[250px] bg-black/5 flex items-center justify-center border-r">
                                        <Image
                                            src={cert.certificateImage}
                                            alt={cert.title}
                                            fill
                                            className="object-contain"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <a
                                                href={cert.certificateImage}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-primary transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="p-5 space-y-4 flex flex-col">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <UserIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-medium">Profesional</p>
                                                    <p className="font-semibold">{cert.user.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{cert.user.email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> Fecha Emisión
                                                    </p>
                                                    <p className="text-xs font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                                        <Hash className="h-3 w-3" /> N° Certificación
                                                    </p>
                                                    <p className="text-xs font-medium">{cert.certificateNumber || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2">
                                                <label className="text-[10px] text-muted-foreground uppercase font-semibold">Nota del Administrador</label>
                                                <Textarea
                                                    placeholder="Ej: El documento es borroso, favor resubir..."
                                                    className="min-h-[80px] text-sm"
                                                    value={adminNotes[cert.id] || ""}
                                                    onChange={(e) => setAdminNotes({
                                                        ...adminNotes,
                                                        [cert.id]: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleUpdateStatus(cert.id, "REJECTED")}
                                                disabled={isProcessing === cert.id}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Rechazar
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleUpdateStatus(cert.id, "APPROVED")}
                                                disabled={isProcessing === cert.id}
                                            >
                                                {isProcessing === cert.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Aprobar
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
