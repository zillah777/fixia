"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface OnboardingStepServicesProps {
    user: User
    onError: (error: string) => void
}

interface Service {
    name: string
    description: string
    priceFrom: string
}

export function OnboardingStepServices({ user, onError }: OnboardingStepServicesProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [services, setServices] = useState<Service[]>([
        { name: "", description: "", priceFrom: "" },
    ])

    const handleServiceChange = (index: number, field: keyof Service, value: string) => {
        const newServices = [...services]
        newServices[index] = { ...newServices[index], [field]: value }
        setServices(newServices)
    }

    const addService = () => {
        setServices([...services, { name: "", description: "", priceFrom: "" }])
    }

    const removeService = (index: number) => {
        if (services.length > 1) {
            setServices(services.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate at least one service
        const validServices = services.filter((s) => s.name.trim() !== "")
        if (validServices.length === 0) {
            onError("Debes añadir al menos un servicio")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/services/create-bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ services: validServices }),
            })

            if (!res.ok) throw new Error("Error al crear servicios")

            onError("")
        } catch (err) {
            onError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-xl border border-border/40 bg-muted/30 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Servicio {index + 1}</h4>
                            {services.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeService(index)}
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label htmlFor={`name-${index}`} className="text-sm">
                                    Nombre del Servicio *
                                </Label>
                                <Input
                                    id={`name-${index}`}
                                    value={service.name}
                                    onChange={(e) =>
                                        handleServiceChange(index, "name", e.target.value)
                                    }
                                    placeholder="Ej: Reparación de cañerías"
                                    disabled={isLoading}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`desc-${index}`} className="text-sm">
                                    Descripción
                                </Label>
                                <Textarea
                                    id={`desc-${index}`}
                                    value={service.description}
                                    onChange={(e) =>
                                        handleServiceChange(index, "description", e.target.value)
                                    }
                                    placeholder="Describe qué incluye este servicio..."
                                    disabled={isLoading}
                                    className="mt-1 h-20"
                                />
                            </div>

                            <div>
                                <Label htmlFor={`price-${index}`} className="text-sm">
                                    Precio desde ($)
                                </Label>
                                <Input
                                    id={`price-${index}`}
                                    type="number"
                                    value={service.priceFrom}
                                    onChange={(e) =>
                                        handleServiceChange(index, "priceFrom", e.target.value)
                                    }
                                    placeholder="Ej: 5000"
                                    disabled={isLoading}
                                    className="mt-1"
                                    min="0"
                                    step="100"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Precio indicativo. Los clientes podrán consultar presupuestos específicos.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={addService}
                disabled={isLoading}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Añadir otro servicio
            </Button>

            <div className="p-4 rounded-lg bg-primary/5 border border-border/40 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                    💡 Consejos para describir tus servicios:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Sé específico sobre qué incluye tu servicio</li>
                    <li>Menciona tu experiencia y especialidades</li>
                    <li>Establece precios realistas y competitivos</li>
                    <li>Puedes añadir o modificar servicios después en tu perfil</li>
                </ul>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando servicios...
                    </>
                ) : (
                    "Guardar Servicios"
                )}
            </Button>
        </form>
    )
}
