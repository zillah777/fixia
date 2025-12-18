"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function SubscriptionStatusPage() {
    const router = useRouter()
    const params = useParams()
    const status = (params && params.status) ? (params.status as string) : ""

    useEffect(() => {
        // Here you would typically verify the payment status with your backend
        // using the payment_id query parameter if needed.
    }, [status])

    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">¡Pago Exitoso!</CardTitle>
                        <p className="text-center text-muted-foreground mt-2">
                            Tu suscripción profesional ha sido activada correctamente.
                            Ya puedes acceder a todas las funcionalidades.
                        </p>
                    </>
                )
            case "failure":
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <XCircle className="h-16 w-16 text-red-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">Pago Rechazado</CardTitle>
                        <p className="text-center text-muted-foreground mt-2">
                            Hubo un problema al procesar tu pago. Por favor, intenta nuevamente
                            o utiliza otro medio de pago.
                        </p>
                    </>
                )
            case "pending":
                return (
                    <>
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-16 w-16 text-yellow-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">Pago Pendiente</CardTitle>
                        <p className="text-center text-muted-foreground mt-2">
                            Tu pago está siendo procesado. Te notificaremos cuando se complete.
                        </p>
                    </>
                )
            default:
                return (
                    <>
                        <CardTitle className="text-center">Estado Desconocido</CardTitle>
                        <p className="text-center text-muted-foreground mt-2">
                            No pudimos determinar el estado de tu pago.
                        </p>
                    </>
                )
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    {/* Header content handled in renderContent */}
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push("/dashboard")}>
                        Volver al Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
