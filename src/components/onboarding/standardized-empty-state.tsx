"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { LucideIcon, Briefcase, MailQuestion, FileText, Users, Search, TrendingUp, Calendar, Activity, BarChart3, Bell } from "lucide-react"

interface StandardizedEmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
        variant?: "default" | "outline"
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
    children?: ReactNode
}

export function StandardizedEmptyState({
    icon: Icon,
    title,
    description,
    action,
    secondaryAction,
    children,
}: StandardizedEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
            </div>

            {/* Text Content */}
            <div className="space-y-2 max-w-sm">
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Custom Content */}
            {children && <div className="w-full">{children}</div>}

            {/* Actions */}
            {(action || secondaryAction) && (
                <div className="flex gap-3 pt-4">
                    {action && (
                        <Button
                            onClick={action.onClick}
                            variant={action.variant || "default"}
                        >
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button variant="outline" onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

/**
 * Pre-configured empty states for common scenarios
 */

export function EmptyStateNoServices() {
    return (
        <StandardizedEmptyState
            icon={Briefcase}
            title="Sin servicios aún"
            description="Comienza creando tu primer servicio para que los clientes puedan encontrarte."
            action={{
                label: "Crear Servicio",
                onClick: () => {
                    // This will be handled by the parent component
                },
            }}
        />
    )
}

export function EmptyStateNoRequests() {
    return (
        <StandardizedEmptyState
            icon={MailQuestion}
            title="Sin solicitudes aún"
            description="Cuando los clientes creen que eres perfecto para su trabajo, recibirás solicitudes aquí."
            secondaryAction={{
                label: "Ver Cómo Funciona",
                onClick: () => {
                    // Open help drawer
                },
            }}
        />
    )
}

export function EmptyStateNoProposals() {
    return (
        <StandardizedEmptyState
            icon={FileText}
            title="Sin propuestas aún"
            description="Responde a las solicitudes de clientes con propuestas personalizadas para ganar proyectos."
            action={{
                label: "Ver Solicitudes",
                onClick: () => {
                    // Navigate to requests
                },
            }}
        />
    )
}

export function EmptyStateNoMatches() {
    return (
        <StandardizedEmptyState
            icon={Users}
            title="Sin profesionales disponibles"
            description="Parece que no hay profesionales disponibles para tu solicitud en este momento. Intenta más tarde."
            action={{
                label: "Volver Atrás",
                onClick: () => {
                    // Navigate back
                },
            }}
            secondaryAction={{
                label: "Crear Nueva Solicitud",
                onClick: () => {
                    // Create new request
                },
            }}
        />
    )
}

export function EmptyStateSearchResults() {
    return (
        <StandardizedEmptyState
            icon={Search}
            title="Sin resultados"
            description="No encontramos profesionales que coincidan con tu búsqueda. Intenta con otros términos."
            action={{
                label: "Limpiar Filtros",
                onClick: () => {
                    // Clear filters
                },
            }}
        />
    )
}

export function EmptyStateNoOpportunities() {
    return (
        <StandardizedEmptyState
            icon={TrendingUp}
            title="Sin oportunidades disponibles"
            description="No hay oportunidades en este momento. Intenta más tarde o expande tus criterios de búsqueda."
            action={{
                label: "Actualizar",
                onClick: () => {
                    // Refresh page
                    window.location.reload()
                },
            }}
        />
    )
}

export function EmptyStateNoBookings() {
    return (
        <StandardizedEmptyState
            icon={Calendar}
            title="Sin reservas aún"
            description="No tienes reservas confirmadas. Crea una solicitud o responde a oportunidades para comenzar."
        />
    )
}

export function EmptyStateNoActivity() {
    return (
        <StandardizedEmptyState
            icon={Activity}
            title="Sin actividad reciente"
            description="Crea solicitudes, responde propuestas o completa trabajos para ver tu actividad aquí."
        />
    )
}

export function EmptyStateNoData() {
    return (
        <StandardizedEmptyState
            icon={BarChart3}
            title="Sin datos suficientes"
            description="No hay suficientes datos para mostrar estadísticas. Completa más transacciones para ver tu progreso."
        />
    )
}

export function EmptyStateNoNotifications() {
    return (
        <StandardizedEmptyState
            icon={Bell}
            title="Sin notificaciones"
            description="Estás al día. No hay notificaciones nuevas por el momento."
        />
    )
}

export function EmptyStateNoProfessionals() {
    return (
        <StandardizedEmptyState
            icon={Users}
            title="Sin resultados"
            description="No se encontraron profesionales que coincidan con tu búsqueda. Intenta con otros criterios."
            action={{
                label: "Limpiar búsqueda",
                onClick: () => {
                    // Clear search filters
                },
            }}
        />
    )
}

export function EmptyStateNoClients() {
    return (
        <StandardizedEmptyState
            icon={Users}
            title="Sin resultados"
            description="No se encontraron clientes que coincidan con tu búsqueda. Intenta con otros criterios."
            action={{
                label: "Limpiar búsqueda",
                onClick: () => {
                    // Clear search filters
                },
            }}
        />
    )
}
