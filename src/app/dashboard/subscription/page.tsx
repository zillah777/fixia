"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubscribe = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/payments/preference", {
                method: "POST",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Error al crear la suscripción")
            }

            if (data.init_point) {
                window.location.href = data.init_point
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "No se pudo iniciar el proceso de pago. Intenta nuevamente.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-4xl py-10">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Planes Profesionales</h1>
                <p className="text-muted-foreground">
                    Potencia tu carrera con herramientas exclusivas para profesionales.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12 items-start justify-center">
                {/* Free Plan */}
                <Card className="relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <CardHeader>
                        <CardTitle>Básico</CardTitle>
                        <CardDescription>Para empezar en la plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-6">Gratis</div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Perfil público básico</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Recibir solicitudes de clientes</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Hasta 3 propuestas mensuales</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>
                            Plan Actual
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="relative overflow-hidden border-primary shadow-lg scale-105">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMENDADO
                    </div>
                    <CardHeader>
                        <CardTitle>Profesional</CardTitle>
                        <CardDescription>Para quienes buscan crecer seriamente</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-6">
                            $5.000 <span className="text-sm font-normal text-muted-foreground">/mes</span>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Perfil destacado con insignia <span className="font-bold text-yellow-500">VERIFICADO</span></span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Propuestas ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Prioridad en resultados de búsqueda</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Soporte prioritario</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                "Suscribirse Ahora"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
