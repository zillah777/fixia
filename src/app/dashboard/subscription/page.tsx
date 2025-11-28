"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export default function SubscriptionPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubscribe = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan: "professional" }),
            })

            if (!response.ok) {
                throw new Error("Error al iniciar el pago")
            }

            const data = await response.json()
            window.location.href = data.url
        } catch (error) {
            console.error(error)
            toast.error("Hubo un error al procesar tu solicitud. Intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-4xl py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Suscripción Profesional</h1>
                <p className="text-muted-foreground">
                    Activa tu cuenta profesional para recibir solicitudes ilimitadas y contactar clientes.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Free Plan (Client) */}
                <Card className="border-muted">
                    <CardHeader>
                        <CardTitle>Cliente</CardTitle>
                        <CardDescription>Para quienes buscan servicios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-6">Gratis</div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Publicar solicitudes ilimitadas
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Ver perfiles de profesionales
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Sistema de reseñas y calificaciones
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
                <Card className="border-primary shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMENDADO
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Profesional
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </CardTitle>
                        <CardDescription>Para quienes ofrecen servicios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$3.900</span>
                            <span className="text-muted-foreground">/mes</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <strong>0% Comisión</strong> por trabajo realizado
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Acceso ilimitado a oportunidades
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Perfil destacado en búsquedas
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Insignia de Profesional Verificado
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                Soporte prioritario por WhatsApp
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleSubscribe}
                            disabled={isLoading}
                        >
                            {isLoading ? (
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

            <div className="mt-10 text-center text-sm text-muted-foreground">
                <p>
                    El pago se procesa de forma segura a través de MercadoPago.
                    Puedes cancelar tu suscripción en cualquier momento desde tu configuración.
                </p>
            </div>
        </div>
    )
}
