"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, CheckCircle, AlertCircle, Upload, Loader2 } from "lucide-react"

// Mock user ID (in real app, get from session)
const MOCK_USER_ID = "user-123"

export default function VerificationPage() {
    const [status, setStatus] = useState("NOT_STARTED") // NOT_STARTED, PENDING, APPROVED, REJECTED
    const [isLoading, setIsLoading] = useState(false)
    const [idFront, setIdFront] = useState("")
    const [idBack, setIdBack] = useState("")

    // In a real implementation, we would fetch the current status on mount
    // useEffect(() => { fetchStatus() }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!idFront || !idBack) {
            toast.error("Por favor sube ambas imágenes del documento")
            return
        }

        setIsLoading(true)
        try {
            // Simulate API call
            // const res = await fetch('/api/verification', ...)
            await new Promise(resolve => setTimeout(resolve, 2000))

            setStatus("PENDING")
            toast.success("Solicitud enviada exitosamente")
        } catch (error) {
            toast.error("Error al enviar solicitud")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "APPROVED") {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit dark:bg-green-900">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">¡Identidad Verificada!</h2>
                        <p className="text-green-700 dark:text-green-400">
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
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit dark:bg-blue-900">
                            <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Verificación en Proceso</h2>
                        <p className="text-blue-700 dark:text-blue-400">
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
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Arrastra tu imagen aquí o haz clic para subir
                                    </p>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setIdFront("mock-url-front")} // Mock upload
                                    />
                                </div>
                                {idFront && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Imagen cargada</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Dorso del DNI</Label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Arrastra tu imagen aquí o haz clic para subir
                                    </p>
                                    <Input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setIdBack("mock-url-back")} // Mock upload
                                    />
                                </div>
                                {idBack && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Imagen cargada</p>}
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md flex gap-3 items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Tus documentos serán almacenados de forma segura y solo serán utilizados para validar tu identidad. No serán compartidos con terceros.
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar Solicitud
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
