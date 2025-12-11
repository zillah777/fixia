"use client"

import { useState, useEffect } from "react"
import { User } from "@prisma/client"
import { Check, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface OnboardingChecklistProps {
    user: User
}

interface ChecklistItem {
    id: string
    label: string
    description: string
    completed: boolean
    action?: () => void
    actionLabel?: string
    isProfessional?: boolean
}

export function OnboardingChecklist({ user }: OnboardingChecklistProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [items, setItems] = useState<ChecklistItem[]>([])

    useEffect(() => {
        // Initialize checklist based on user role
        const baseItems: ChecklistItem[] = [
            {
                id: "profile",
                label: "Completa tu perfil",
                description: "Añade foto, nombre, ubicación e información personal",
                completed: !!user.name && !!user.location,
                actionLabel: "Editar Perfil",
            },
        ]

        if (user.role === "PROFESSIONAL") {
            baseItems.push(
                {
                    id: "services",
                    label: "Añade tus servicios",
                    description: "Crea al menos un servicio para que los clientes puedan encontrarte",
                    completed: false,
                    actionLabel: "Mis Servicios",
                    isProfessional: true,
                },
                {
                    id: "verification",
                    label: "Verifica tu identidad",
                    description: "Sube tu DNI para que los clientes confíen en ti",
                    completed: false,
                    actionLabel: "Verificar Identidad",
                    isProfessional: true,
                },
                {
                    id: "subscription",
                    label: "Elige un plan",
                    description: "Selecciona el plan que mejor se adapte a tus necesidades",
                    completed: !!user.subscriptionPlan,
                    actionLabel: "Ver Planes",
                    isProfessional: true,
                }
            )
        }

        setItems(baseItems)
    }, [user])

    const completedCount = items.filter((item) => item.completed).length
    const totalCount = items.length
    const progress = Math.round((completedCount / totalCount) * 100)

    return (
        <Card className="border-border/40">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    Checklist de Configuración
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {completedCount} de {totalCount} completado ({progress}%)
                                </CardDescription>
                            </div>
                            <ChevronDown
                                className={`h-5 w-5 text-muted-foreground transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="space-y-3 pt-0">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 rounded-lg border transition-all ${
                                    item.completed
                                        ? "border-primary/30 bg-primary/5"
                                        : "border-border/40 bg-muted/30 hover:border-border/60"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            item.completed
                                                ? "bg-primary border-primary"
                                                : "border-muted-foreground"
                                        }`}
                                    >
                                        {item.completed && (
                                            <Check className="h-4 w-4 text-primary-foreground" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4
                                                className={`font-semibold ${
                                                    item.completed
                                                        ? "text-muted-foreground line-through"
                                                        : "text-foreground"
                                                }`}
                                            >
                                                {item.label}
                                            </h4>
                                            {item.isProfessional && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                    Pro
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>

                                    {item.actionLabel && !item.completed && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-shrink-0"
                                            onClick={item.action}
                                        >
                                            {item.actionLabel}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {completedCount === totalCount && (
                            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center space-y-2">
                                <p className="font-semibold text-primary">🎉 ¡Configuración Completa!</p>
                                <p className="text-sm text-muted-foreground">
                                    Ya estás listo para usar todas las funciones de Fixia.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
