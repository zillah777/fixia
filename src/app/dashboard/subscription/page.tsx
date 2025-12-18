"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Calendar, CreditCard, ShieldCheck, AlertTriangle, ArrowLeft, Sparkles, Clock } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function SubscriptionPage() {
    const { user, refreshUser } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [cancelling, setCancelling] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/payments/preference", {
                method: "POST",
            })
            const data = await response.json()
            if (data.init_point) {
                window.location.href = data.init_point
            } else if (data.url) {
                // Fallback for old API response format
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

    const handleCancelSubscription = async () => {
        setCancelling(true)
        try {
            const res = await fetch("/api/payments/cancel", { method: "POST" })
            if (res.ok) {
                toast.success("Suscripción cancelada correctamente")
                await refreshUser()
                router.refresh()
            } else {
                toast.error("Error al cancelar la suscripción")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error de conexión")
        } finally {
            setCancelling(false)
        }
    }

    const isSubscriptionActive = user?.subscriptionStatus === "active"
    const isSubscriptionTrial = user?.subscriptionStatus === "trial"
    const isSubscriptionCancelled = user?.subscriptionStatus === "cancelled"
    const hasValidDate = user?.subscriptionEndsAt && new Date(user.subscriptionEndsAt) > new Date()
    const isProWithAccess = user?.role === "PROFESSIONAL" && (isSubscriptionActive || isSubscriptionTrial || (isSubscriptionCancelled && hasValidDate))

    // View for Active/Valid Professional
    if (isProWithAccess) {
        return (
            <div className="container mx-auto py-10 max-w-3xl">
                <div className="flex flex-col gap-4 mb-8">
                    <Link href="/dashboard/opportunities" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">Tu Suscripción</h1>
                        {isSubscriptionTrial ? (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-base px-4 py-1">
                                <Sparkles className="h-4 w-4 mr-1 inline" />
                                Período de Prueba
                            </Badge>
                        ) : isSubscriptionCancelled ? (
                            <Badge variant="destructive" className="text-base px-4 py-1">Cancelada (Vence pronto)</Badge>
                        ) : (
                            <Badge className="bg-accent hover:bg-accent text-base px-4 py-1">Activa</Badge>
                        )}
                    </div>
                </div>

                {isSubscriptionTrial && user?.subscriptionEndsAt && (
                    <Alert className="bg-emerald-50 border-emerald-200 mb-6">
                        <Sparkles className="h-4 w-4 text-emerald-600" />
                        <AlertTitle className="text-emerald-900">Tu período de prueba está activo</AlertTitle>
                        <AlertDescription className="text-emerald-700 mt-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4" />
                                <span>Vence el <strong>{new Date(user.subscriptionEndsAt).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></span>
                            </div>
                            <p className="text-sm">Al finalizar tu período de prueba, necesitarás suscribirte para mantener el acceso a todas las funcionalidades profesionales.</p>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6">
                    <Card className={isSubscriptionTrial ? 'border-emerald-200 bg-emerald-50/50' : isSubscriptionCancelled ? 'border-orange-200 bg-orange-50/50' : 'border-green-200 bg-green-50/50'}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className={isSubscriptionTrial ? 'h-6 w-6 text-emerald-600' : isSubscriptionCancelled ? 'h-6 w-6 text-orange-600' : 'h-6 w-6 text-green-600'} />
                                Plan Profesional
                            </CardTitle>
                            <CardDescription>
                                {isSubscriptionTrial
                                    ? "Estás en tu período de prueba de 30 días. Disfruta de todos los beneficios sin costo."
                                    : isSubscriptionCancelled
                                        ? "Tu suscripción ha sido cancelada pero aún tienes acceso hasta la fecha de vencimiento."
                                        : "Estás disfrutando de todos los beneficios de Fixia Pro."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{isSubscriptionCancelled ? "Vence el" : "Próxima renovación"}</p>
                                        <p className="font-semibold">
                                            {user?.subscriptionEndsAt
                                                ? new Date(user.subscriptionEndsAt).toLocaleDateString()
                                                : "Gestionado por MercadoPago"
                                            }
                                        </p>
                                    </div>
                                </div>
                                {!isSubscriptionCancelled && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/5">
                                                Cancelar Suscripción
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Al cancelar, mantendrás tus beneficios hasta el final del período actual. Después, tu cuenta volverá al estado &quot;Cliente&quot; y tus ofertas dejarán de ser visibles.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Volver</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
                                                    {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Cancelación"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Método de pago</p>
                                        <p className="font-semibold">MercadoPago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Propuestas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-primary">Ilimitadas</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Comisión</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-accent">0%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Visibilidad</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-secondary">Alta</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Default View (Sales Page)
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Suscripción Profesional</h1>
            <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
                <Card className="border-primary shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMENDADO
                    </div>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Plan Profesional</CardTitle>
                        <CardDescription>Todo lo que necesitas para crecer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <span className="text-5xl font-extrabold text-[#009EE3]">$3.900</span>
                            <span className="text-gray-500 font-medium">/mes</span>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <li className="flex items-start gap-3">
                                <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                                    <Check className="h-3 w-3 text-accent" />
                                </div>
                                <span className="text-sm">Postulaciones <b>ilimitadas</b> a trabajos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                                    <Check className="h-3 w-3 text-accent" />
                                </div>
                                <span className="text-sm">Perfil destacado con insignia <b>VERIFICADO</b></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                                    <Check className="h-3 w-3 text-accent" />
                                </div>
                                <span className="text-sm"><b>0% de comisión</b> por trabajo realizado</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="bg-accent/10 p-1 rounded-full mt-0.5">
                                    <Check className="h-3 w-3 text-accent" />
                                </div>
                                <span className="text-sm">Soporte prioritario 24/7</span>
                            </li>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-8">
                        <Button
                            className="w-full h-12 text-lg font-bold shadow-md hover:shadow-xl transition-all"
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                "Obtener Acceso Total"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
                <p className="text-center text-xs text-muted-foreground">
                    Pago seguro procesado por MercadoPago. Puedes cancelar en cualquier momento.
                </p>
            </div>
        </div>
    )
}
