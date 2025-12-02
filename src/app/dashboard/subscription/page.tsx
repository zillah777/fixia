"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/payments/preference", {
                method: "POST",
            })
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                toast.error("Error al iniciar el pago")
            }
        } catch (error) {
            console.error(error)
            toast.error("Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Suscripción Profesional</h1>
            <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Plan Profesional</CardTitle>
                        <CardDescription>Todo lo que necesitas para crecer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-4">$4.999<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Postulaciones ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Perfil destacado</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Insignia de verificado</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Soporte prioritario</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
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
