"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OnboardingStepSubscriptionProps {
    user: User
    onError: (error: string) => void
}

interface Plan {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    recommended?: boolean
}

const PLANS: Plan[] = [
    {
        id: "basic",
        name: "Básico",
        price: 0,
        description: "Perfecto para comenzar",
        features: [
            "Perfil de profesional",
            "Hasta 3 servicios",
            "Recibir solicitudes",
            "Mensajes con clientes",
        ],
    },
    {
        id: "pro",
        name: "Profesional",
        price: 4999,
        description: "Para profesionales activos",
        features: [
            "Todo en Básico",
            "Servicios ilimitados",
            "Estadísticas detalladas",
            "Prioridad en búsquedas",
            "Badge verificado",
            "Soporte por chat",
        ],
        recommended: true,
    },
    {
        id: "premium",
        name: "Premium",
        price: 9999,
        description: "Máxima visibilidad",
        features: [
            "Todo en Profesional",
            "Featured en búsquedas",
            "Portfolio multimedia",
            "Análisis avanzados",
            "Soporte prioritario",
            "Publicidad personalizada",
        ],
    },
]

export function OnboardingStepSubscription({ user, onError }: OnboardingStepSubscriptionProps) {
    const [selectedPlan, setSelectedPlan] = useState<string>("basic")
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectPlan = async (planId: string) => {
        setSelectedPlan(planId)
        setIsLoading(true)

        try {
            const res = await fetch("/api/subscription/select-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            })

            if (!res.ok) throw new Error("Error al seleccionar plan")

            onError("")
        } catch (err) {
            onError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-muted-foreground">
                    Elige el plan que mejor se adapte a tus necesidades. Puedes cambiar de plan en cualquier momento.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative cursor-pointer overflow-hidden transition-all ${
                            selectedPlan === plan.id
                                ? "ring-2 ring-primary border-primary"
                                : "border-border/40"
                        } ${plan.recommended ? "md:scale-105 md:z-10" : ""}`}
                        onClick={() => handleSelectPlan(plan.id)}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-semibold py-1 text-center">
                                RECOMENDADO
                            </div>
                        )}

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    {plan.price > 0 && (
                                        <span className="text-sm text-muted-foreground">/mes</span>
                                    )}
                                </div>
                                {plan.price === 0 && (
                                    <p className="text-xs text-muted-foreground">Siempre gratis</p>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-3 items-start">
                                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={selectedPlan === plan.id ? "default" : "outline"}
                                disabled={isLoading}
                                onClick={() => handleSelectPlan(plan.id)}
                            >
                                {selectedPlan === plan.id ? "Seleccionado" : "Seleccionar"}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border/40 space-y-2">
                <p className="text-sm font-semibold">💡 ¿No estás seguro?</p>
                <p className="text-xs text-muted-foreground">
                    Comienza con el plan Básico (gratis) y actualiza cuando lo necesites. No hay compromiso a largo plazo.
                </p>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-border/40">
                <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Nota:</span> Los planes de pago requieren verificación de identidad. Pasaremos a ese paso en seguida.
                </p>
            </div>
        </div>
    )
}
