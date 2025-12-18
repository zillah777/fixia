"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, CheckCircle, AlertCircle, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

export default function VerificationPage() {
    const [status, setStatus] = useState("NOT_STARTED") // NOT_STARTED, PENDING, APPROVED, REJECTED
    const [isLoading, setIsLoading] = useState(false)
    const [idFront, setIdFront] = useState("")
    const [idBack, setIdBack] = useState("")
    const [uploadingFront, setUploadingFront] = useState(false)
    const [uploadingBack, setUploadingBack] = useState(false)

    // Fetch current status on mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/verification')
                if (res.ok) {
                    const data = await res.json()
                    setStatus(data.status)
                }
            } catch (error) {
                console.error("Error fetching status:", error)
            }
        }
        fetchStatus()
    }, [])

    const uploadFile = async (file: File) => {
        // 1. Get signature
        const sigRes = await fetch('/api/upload/cloudinary', {
            method: 'POST',
            body: JSON.stringify({ uploadType: 'verification' })
        })
        const sigData = await sigRes.json()
        if (!sigRes.ok) throw new Error(sigData.error)

        // 2. Upload to Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', sigData.apiKey)
        formData.append('timestamp', sigData.timestamp.toString())
        formData.append('signature', sigData.signature)
        formData.append('folder', sigData.folder)

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error.message)

        return uploadData.secure_url
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const file = e.target.files?.[0]
        if (!file) return

        const setUploading = type === 'front' ? setUploadingFront : setUploadingBack
        const setUrl = type === 'front' ? setIdFront : setIdBack

        setUploading(true)
        try {
            const url = await uploadFile(file)
            setUrl(url)
            toast.success("Imagen cargada exitosamente")
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Error al subir imagen")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!idFront || !idBack) {
            toast.error("Por favor sube ambas imágenes del documento")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idFront, idBack })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Error al enviar solicitud")
            }

            setStatus("PENDING")
            toast.success("Solicitud enviada exitosamente")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "APPROVED") {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card className="border-accent/20 bg-accent/5 dark:bg-green-900/20">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit dark:bg-green-900">
                            <CheckCircle className="h-12 w-12 text-accent dark:text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-accent dark:text-accent">¡Identidad Verificada!</h2>
                        <p className="text-accent dark:text-accent">
                            Tu perfil ahora muestra la insignia de verificación, lo que genera más confianza en los clientes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (status === "PENDING") {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card className="border-secondary/20 bg-secondary/5 dark:bg-blue-900/20">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto bg-secondary/10 p-3 rounded-full w-fit dark:bg-blue-900">
                            <Loader2 className="h-12 w-12 text-secondary dark:text-blue-400 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary dark:text-blue-300">Verificación en Proceso</h2>
                        <p className="text-secondary dark:text-blue-400">
                            Estamos revisando tus documentos. Esto puede demorar hasta 24 horas hábiles.
                            Te notificaremos cuando el proceso finalice.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Verificación de Identidad</h1>
                <p className="text-muted-foreground">
                    Verifica tu identidad para obtener la insignia de confianza y acceder a más trabajos.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Documentación Requerida
                    </CardTitle>
                    <CardDescription>
                        Necesitamos una foto clara del frente y dorso de tu DNI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Frente del DNI</Label>
                                <div
                                    className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${idFront
                                        ? 'border-solid border-accent/30 bg-accent/5'
                                        : 'border-dashed border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onClick={() => document.getElementById('dni-front')?.click()}
                                >
                                    {uploadingFront ? (
                                        <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin" />
                                    ) : idFront ? (
                                        <>
                                            <Image src={idFront} alt="DNI Frente" fill className="object-contain p-2" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded">Click para cambiar</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Arrastra tu imagen aquí o haz clic para subir
                                            </p>
                                        </>
                                    )}
                                    <Input
                                        id="dni-front"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'front')}
                                        disabled={uploadingFront}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Dorso del DNI</Label>
                                <div
                                    className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${idBack
                                        ? 'border-solid border-accent/30 bg-accent/5'
                                        : 'border-dashed border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onClick={() => document.getElementById('dni-back')?.click()}
                                >
                                    {uploadingBack ? (
                                        <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin" />
                                    ) : idBack ? (
                                        <>
                                            <Image src={idBack} alt="DNI Dorso" fill className="object-contain p-2" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded">Click para cambiar</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Arrastra tu imagen aquí o haz clic para subir
                                            </p>
                                        </>
                                    )}
                                    <Input
                                        id="dni-back"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'back')}
                                        disabled={uploadingBack}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md flex gap-3 items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Tus documentos serán almacenados de forma segura y solo serán utilizados para validar tu identidad. No serán compartidos con terceros.
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading || !idFront || !idBack}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Solicitud
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
