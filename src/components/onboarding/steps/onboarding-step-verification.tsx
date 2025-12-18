"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OnboardingStepVerificationProps {
    user: User
    onError: (error: string) => void
}

type VerificationStep = "pending" | "uploading" | "submitted"

export function OnboardingStepVerification({ user, onError }: OnboardingStepVerificationProps) {
    const [verificationStep, setVerificationStep] = useState<VerificationStep>("pending")
    const [isLoading, setIsLoading] = useState(false)
    const [documents, setDocuments] = useState({
        idFront: null as File | null,
        idBack: null as File | null,
        certificate: null as File | null,
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof documents) => {
        const file = e.target.files?.[0]
        if (file) {
            setDocuments((prev) => ({ ...prev, [key]: file }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!documents.idFront || !documents.idBack) {
            onError("Debes subir ambos lados de tu DNI")
            return
        }

        setIsLoading(true)
        setVerificationStep("uploading")

        try {
            const formData = new FormData()
            formData.append("idFront", documents.idFront)
            formData.append("idBack", documents.idBack)
            if (documents.certificate) {
                formData.append("certificate", documents.certificate)
            }

            const res = await fetch("/api/verification/submit", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Error al enviar documentos")

            setVerificationStep("submitted")
            onError("")
        } catch (err) {
            onError(err instanceof Error ? err.message : "Error desconocido")
            setVerificationStep("pending")
        } finally {
            setIsLoading(false)
        }
    }

    if (verificationStep === "submitted") {
        return (
            <div className="space-y-6 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Documentos Enviados</h3>
                    <p className="text-muted-foreground">
                        Hemos recibido tus documentos. Revisaremos tu identidad en las próximas 24 horas.
                    </p>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Mientras revisamos tu identidad, podrás usar la plataforma con funciones limitadas. Te notificaremos cuando se complete la verificación.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    La verificación de identidad es requerida para ciertos servicios de la plataforma. Tus datos están protegidos y verificados de manera segura.
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                {/* ID Front */}
                <div className="space-y-3">
                    <Label>Cédula de Identidad - Frente *</Label>
                    <div
                        className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${documents.idFront
                            ? 'border-solid border-primary/30 bg-primary/5'
                            : 'border-dashed border-border/40 hover:border-border'
                            }`}
                        onClick={() => !isLoading && document.getElementById('id-front-input')?.click()}
                    >
                        {documents.idFront ? (
                            <>
                                <Image
                                    src={URL.createObjectURL(documents.idFront)}
                                    alt="Frente"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">Click para cambiar</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <div className="text-center">
                                    <p className="font-medium text-sm text-primary">Haz clic para subir</p>
                                    <p className="text-xs text-muted-foreground">Frente del DNI</p>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            id="id-front-input"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "idFront")}
                            disabled={isLoading}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* ID Back */}
                <div className="space-y-3">
                    <Label>Cédula de Identidad - Dorso *</Label>
                    <div
                        className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${documents.idBack
                            ? 'border-solid border-primary/30 bg-primary/5'
                            : 'border-dashed border-border/40 hover:border-border'
                            }`}
                        onClick={() => !isLoading && document.getElementById('id-back-input')?.click()}
                    >
                        {documents.idBack ? (
                            <>
                                <Image
                                    src={URL.createObjectURL(documents.idBack)}
                                    alt="Dorso"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">Click para cambiar</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <div className="text-center">
                                    <p className="font-medium text-sm text-primary">Haz clic para subir</p>
                                    <p className="text-xs text-muted-foreground">Dorso del DNI</p>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            id="id-back-input"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "idBack")}
                            disabled={isLoading}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Certificate (Optional) */}
                <div className="space-y-3">
                    <Label>Certificado Profesional (Opcional)</Label>
                    <div
                        className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${documents.certificate
                            ? 'border-solid border-primary/30 bg-primary/5'
                            : 'border-dashed border-border/40 hover:border-border'
                            }`}
                        onClick={() => !isLoading && document.getElementById('certificate-input')?.click()}
                    >
                        {documents.certificate ? (
                            documents.certificate.type === "application/pdf" ? (
                                <div className="text-center p-4">
                                    <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-medium truncate max-w-[200px]">{documents.certificate.name}</p>
                                    <p className="text-xs text-muted-foreground">(PDF cargado)</p>
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src={URL.createObjectURL(documents.certificate)}
                                        alt="Certificado"
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">Click para cambiar</span>
                                    </div>
                                </>
                            )
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <div className="text-center">
                                    <p className="font-medium text-sm text-primary">Haz clic para subir</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, PDF</p>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            id="certificate-input"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "certificate")}
                            disabled={isLoading}
                            className="hidden"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Certificados o títulos profesionales ayudan a generar más confianza con los clientes.
                    </p>
                </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <span className="font-semibold">💡 Consejos:</span> Asegúrate de que los documentos sean legibles y completamente visibles. Evita reflejos y sombras.
                </AlertDescription>
            </Alert>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando documentos...
                    </>
                ) : (
                    "Enviar Documentos"
                )}
            </Button>
        </form>
    )
}
