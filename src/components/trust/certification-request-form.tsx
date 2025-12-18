"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle2, AlertCircle, Loader2, Clock, XCircle, Award } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type CertificationStatus = "IDLE" | "PENDING" | "APPROVED" | "REJECTED"

interface CertificationData {
    id: string
    title: string
    issuingBody: string
    issueDate: string
    certificateImage: string
    certificateNumber?: string
    status: CertificationStatus
    adminNote?: string
    createdAt: string
}

export function CertificationRequestForm() {
    const [status, setStatus] = useState<CertificationStatus>("IDLE")
    const [certificationData, setCertificationData] = useState<CertificationData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    // Form fields
    const [title, setTitle] = useState("")
    const [issuingBody, setIssuingBody] = useState("")
    const [issueDate, setIssueDate] = useState("")
    const [certificateNumber, setCertificateNumber] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Fetch existing certification
    useEffect(() => {
        async function fetchCertification() {
            try {
                const res = await fetch("/api/certifications")
                if (res.ok) {
                    const data = await res.json()
                    if (data.certifications && data.certifications.length > 0) {
                        const cert = data.certifications[0]
                        setCertificationData(cert)
                        setStatus(cert.status as CertificationStatus)
                    }
                }
            } catch (error) {
                console.error("Error fetching certification:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCertification()
    }, [])

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no puede superar 5MB")
                return
            }
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Upload to Cloudinary
    async function uploadFile(file: File): Promise<string> {
        try {
            // Get signed upload URL from backend
            const signRes = await fetch("/api/upload/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadType: "certification", tags: "certification" }),
                credentials: "include"
            })

            if (!signRes.ok) throw new Error("Error obteniendo firma de Cloudinary")

            const { signature, timestamp, apiKey, uploadUrl, folder, tags: signedTags } = await signRes.json()

            // Upload to Cloudinary
            const formData = new FormData()
            formData.append("file", file)
            formData.append("signature", signature)
            formData.append("timestamp", timestamp.toString())
            formData.append("api_key", apiKey)
            formData.append("folder", folder)
            if (signedTags) {
                formData.append("tags", signedTags)
            }

            const uploadRes = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            })

            if (!uploadRes.ok) throw new Error("Error subiendo imagen")

            const data = await uploadRes.json()
            return data.secure_url
        } catch (error) {
            console.error("Upload error:", error)
            throw error
        }
    }

    // Submit certification request
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!imageFile) {
            toast.error("Debes subir una imagen de tu certificación")
            return
        }

        if (!title || !issuingBody || !issueDate) {
            toast.error("Completá todos los campos requeridos")
            return
        }

        setIsUploading(true)
        const toastId = toast.loading("Subiendo certificación...")

        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadFile(imageFile)

            // Create certification request
            const res = await fetch("/api/certifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    issuingBody,
                    issueDate: new Date(issueDate).toISOString(),
                    certificateImage: imageUrl,
                    certificateNumber: certificateNumber || undefined
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Error al enviar solicitud")
            }

            const data = await res.json()
            setCertificationData(data.certification)
            setStatus("PENDING")
            toast.success("Solicitud enviada exitosamente", { id: toastId })

            // Reset form
            setTitle("")
            setIssuingBody("")
            setIssueDate("")
            setCertificateNumber("")
            setImageFile(null)
            setImagePreview(null)
        } catch (error: any) {
            console.error("Error submitting certification:", error)
            toast.error(error.message || "Error al enviar solicitud", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Status: APPROVED
    if (status === "APPROVED" && certificationData) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-green-900">Certificación Verificada</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-green-800">
                            <strong>{certificationData.title}</strong>
                        </p>
                        <p className="text-sm text-green-700">
                            Emitido por: {certificationData.issuingBody}
                        </p>
                        {certificationData.certificateNumber && (
                            <p className="text-sm text-green-700">
                                N° {certificationData.certificateNumber}
                            </p>
                        )}
                    </div>
                    {certificationData.certificateImage && (
                        <div className="relative w-full max-w-md h-48">
                            <Image
                                src={certificationData.certificateImage}
                                alt="Certificación"
                                fill
                                className="object-contain rounded-lg"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    // Status: PENDING
    if (status === "PENDING" && certificationData) {
        return (
            <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <CardTitle className="text-yellow-900">Verificación en Proceso</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-yellow-800">
                        Tu certificación está siendo revisada por nuestro equipo. Te notificaremos cuando sea aprobada.
                    </p>
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-yellow-700">
                            <strong>Título:</strong> {certificationData.title}
                        </p>
                        <p className="text-sm text-yellow-700">
                            <strong>Emitido por:</strong> {certificationData.issuingBody}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Status: REJECTED
    if (status === "REJECTED" && certificationData) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-red-900">Certificación Rechazada</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {certificationData.adminNote && (
                        <Alert>
                            <AlertDescription>{certificationData.adminNote}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        onClick={() => {
                            setStatus("IDLE")
                            setCertificationData(null)
                        }}
                        variant="outline"
                    >
                        Enviar Nueva Solicitud
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // Status: IDLE (form)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Certificaciones Profesionales</CardTitle>
                <CardDescription>
                    Subí títulos, diplomas o certificaciones profesionales para verificar tus credenciales.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Título de la Certificación *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ej: Ingeniero Civil, Técnico Electricista"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="issuingBody">Entidad Emisora *</Label>
                            <Input
                                id="issuingBody"
                                value={issuingBody}
                                onChange={(e) => setIssuingBody(e.target.value)}
                                placeholder="ej: Universidad Nacional, Ministerio de Educación"
                                required
                            />
                        </div>

                        <div lang="es">
                            <Label htmlFor="issueDate">Fecha de Emisión *</Label>
                            <Input
                                id="issueDate"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="certificateNumber">Número de Matrícula/Certificado (opcional)</Label>
                            <Input
                                id="certificateNumber"
                                value={certificateNumber}
                                onChange={(e) => setCertificateNumber(e.target.value)}
                                placeholder="ej: MP-12345"
                            />
                        </div>

                        <div>
                            <Label>Imagen del Certificado *</Label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden h-40 mt-2"
                                onClick={() => document.getElementById('cert-image')?.click()}
                            >
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click para subir</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="cert-image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Máximo 5MB. Formatos: JPG, PNG
                            </p>
                        </div>
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Tus documentos se almacenan de forma segura y solo se utilizan para validar tu identidad profesional.
                        </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Award className="mr-2 h-4 w-4" />
                                Enviar para Verificación
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
