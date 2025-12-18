"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function VerificationRequestForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"IDLE" | "PENDING" | "APPROVED">("IDLE")
    const [files, setFiles] = useState<{ front: File | null; back: File | null }>({ front: null, back: null })
    const [previews, setPreviews] = useState<{ front: string | null; back: string | null }>({ front: null, back: null })

    const handleFileChange = (type: "front" | "back", e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }))
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setPreviews(prev => ({ ...prev, [type]: result }))
                // Show confirmation that file was selected
                const sideLabel = type === "front" ? "Frente" : "Dorso"
                toast.success(`${sideLabel} del DNI cargado`, {
                    description: "Puedes ver el preview arriba. Cuando termines, haz click en 'Enviar Documentos'.",
                    duration: 3000
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Fetch status on mount
    useEffect(() => {
        fetch("/api/users/verification")
            .then(res => res.json())
            .then(data => {
                if (data.status && data.status !== "IDLE") {
                    setStatus(data.status)
                }
            })
            .catch(console.error)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!files.front || !files.back) {
            toast.error("Debes subir ambas fotos del DNI")
            return
        }

        setIsLoading(true)
        const toastId = toast.loading("Subiendo documentos...")

        try {
            // Upload Front
            const frontRes = await uploadFile(files.front, "dni_front")
            // Upload Back
            const backRes = await uploadFile(files.back, "dni_back")

            // Submit to Backend
            const res = await fetch("/api/users/verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idFront: frontRes.secure_url,
                    idBack: backRes.secure_url
                })
            })

            if (!res.ok) throw new Error("Error al procesar solicitud")

            setStatus("PENDING")
            toast.success("Documentos enviados correctamente", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Error al subir documentos", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    const uploadFile = async (file: File, type: string) => {
        // 1. Get signed token
        const tags = `verification,${type}`
        const tokenRes = await fetch("/api/upload/cloudinary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uploadType: "verification", tags }),
            credentials: "include" // Ensure cookies are sent
        })

        if (!tokenRes.ok) throw new Error("Error obteniendo token")
        const { signature, timestamp, folder, apiKey, uploadUrl, tags: signedTags } = await tokenRes.json()

        // 2. Upload to Cloudinary
        const formData = new FormData()
        formData.append("file", file)
        formData.append("api_key", apiKey)
        formData.append("timestamp", timestamp.toString())
        formData.append("signature", signature)
        formData.append("folder", folder)
        if (signedTags) formData.append("tags", signedTags)

        const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData
        })

        if (!uploadRes.ok) throw new Error("Error subiendo a Cloudinary")
        return await uploadRes.json()
    }

    if (status === "PENDING") {
        return (
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <ClockIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-amber-900">Verificación en Proceso</h3>
                    <p className="text-amber-700 mt-2">
                        Nuestro equipo está revisando tus documentos. Esto puede demorar hasta 24 horas hábiles.
                    </p>
                </CardContent>
            </Card>
        )
    }

    if (status === "APPROVED") {
        return (
            <Card className="border-accent/20 bg-accent/5">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-green-900">¡Identidad Verificada!</h3>
                    <p className="text-accent mt-2">
                        Tu perfil ahora muestra la insignia de verificación, lo que aumenta la confianza de los clientes.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verificación de Identidad</CardTitle>
                <CardDescription>
                    Sube una foto de tu DNI (frente y dorso) para obtener la insignia de &quot;Verificado&quot;.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>DNI Frente</Label>
                            <div
                                className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${
                                    previews.front
                                        ? 'border-solid border-green-300 bg-green-50'
                                        : 'border-dashed border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => document.getElementById('dni-front')?.click()}
                            >
                                {previews.front ? (
                                    <>
                                        <img src={previews.front} alt="DNI Frente" className="absolute inset-0 w-full h-full object-contain p-2" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium">Click para cambiar</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click para subir</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="dni-front"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("front", e)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>DNI Dorso</Label>
                            <div
                                className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden h-40 ${
                                    previews.back
                                        ? 'border-solid border-green-300 bg-green-50'
                                        : 'border-dashed border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => document.getElementById('dni-back')?.click()}
                            >
                                {previews.back ? (
                                    <>
                                        <img src={previews.back} alt="DNI Dorso" className="absolute inset-0 w-full h-full object-contain p-2" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium">Click para cambiar</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click para subir</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="dni-back"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("back", e)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/5 p-4 rounded-lg flex gap-3 text-sm text-secondary">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            Tus documentos se almacenan de forma segura y solo se utilizan para validar tu identidad. No serán visibles públicamente.
                        </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar Documentos"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
