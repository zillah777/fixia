"use client"

import { Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface FormFieldHelperProps {
    tip: string
    example?: string
    variant?: "inline" | "tooltip" | "block"
}

/**
 * Provides contextual help for form fields
 * Can display as inline text, tooltip, or block help text
 */
export function FormFieldHelper({
    tip,
    example,
    variant = "inline",
}: FormFieldHelperProps) {
    if (variant === "block") {
        return (
            <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                <p className="text-xs font-semibold text-primary">💡 {tip}</p>
                {example && (
                    <p className="text-xs text-muted-foreground">{example}</p>
                )}
            </div>
        )
    }

    if (variant === "tooltip") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Info className="h-4 w-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                        <div className="space-y-1">
                            <p className="font-semibold">{tip}</p>
                            {example && (
                                <p className="text-xs">{example}</p>
                            )}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    // Default inline variant
    return (
        <p className="text-xs text-muted-foreground mt-1">
            💡 {tip}
            {example && <span className="block mt-1">{example}</span>}
        </p>
    )
}

/**
 * Pre-configured helpers for common form fields
 */

export function TitleFieldHelper() {
    return (
        <FormFieldHelper
            tip="Sé específico y claro. Evita palabras genéricas."
            example="✓ 'Reparación de grifo de agua caliente' vs ✗ 'Reparación'"
            variant="block"
        />
    )
}

export function DescriptionFieldHelper() {
    return (
        <FormFieldHelper
            tip="Cuanta más información des, mejor respuestas recibirás."
            example="Describe el problema, cuándo empezó, qué ya intentaste, etc."
            variant="block"
        />
    )
}

export function PriceFieldHelper() {
    return (
        <FormFieldHelper
            tip="Sé realista. Precios bajos alejan profesionales serios."
            example="Considera materiales, tiempo y ubicación."
            variant="block"
        />
    )
}

export function BudgetFieldHelper() {
    return (
        <FormFieldHelper
            tip="Presupuesto realista atrae profesionales de calidad."
            variant="block"
        />
    )
}

export function BioFieldHelper() {
    return (
        <FormFieldHelper
            tip="Profesionales con biografía detallada reciben 3x más solicitudes."
            example="Menciona experiencia, especialización y por qué destacas."
            variant="block"
        />
    )
}

export function AvailabilityFieldHelper() {
    return (
        <FormFieldHelper
            tip="Mayor disponibilidad = más solicitudes."
            example="Si es urgente, menciona disponibilidad fuera de horario."
            variant="block"
        />
    )
}

export function MessageFieldHelper() {
    return (
        <FormFieldHelper
            tip="Personaliza cada propuesta. Responde rápido (dentro de 2hs)."
            example="Explica por qué eres el mejor para este trabajo."
            variant="block"
        />
    )
}

export function TagsFieldHelper() {
    return (
        <FormFieldHelper
            tip="Máximo 5 etiquetas. Usa palabras que los clientes buscan."
            example="'Reparación urgente' en lugar de 'Trabajo'"
            variant="block"
        />
    )
}
