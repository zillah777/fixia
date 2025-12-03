"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function VerificationRequestForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"IDLE" | "PENDING" | "APPROVED">("IDLE")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API upload
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
        setStatus("PENDING")
        toast.success("Documentos enviados para revisión")
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
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-green-900">¡Identidad Verificada!</h3>
                    <p className="text-green-700 mt-2">
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
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click para subir</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>DNI Dorso</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click para subir</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
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
