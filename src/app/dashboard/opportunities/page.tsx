"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { TeaserCard } from "@/components/opportunities/teaser-card"
import { CATEGORIES } from "@/config/categories"
import { Loader2, Info, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import { LeadsHelp } from "@/components/onboarding/form-help-context"

import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OpportunitiesPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                // Fetch ALL open requests (marketplace mode)
                const res = await fetch("/api/requests?mode=marketplace")
                if (res.ok) {
                    const data = await res.json()
                    const formatted = data.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        category: CATEGORIES.find(c => c.id === r.categoryId)?.label || r.category?.name || "General",
                        status: r.status,
                        budget: {
                            min: Number(r.budget) || 0,
                            max: Number(r.budget) || 0,
                            currency: "ARS"
                        },
                        location: r.location,
                        date: new Date(r.createdAt).toLocaleDateString(),
                        proposalsCount: r._count?.proposals || 0
                    }))
                    setRequests(formatted)
                }
            } catch (error) {
                console.error("Error fetching opportunities:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOpportunities()
    }, [])

    return (
        <div className="space-y-8 pb-20 md:pb-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white/50 dark:bg-card/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-xl shadow-stone-200/50 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <LeadsHelp />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">Oportunidades de Trabajo</h1>
                        <p className="text-muted-foreground font-medium max-w-2xl text-base">
                            {user?.role === 'PROFESSIONAL'
                                ? "Encuentra nuevos clientes potenciales y envía tus mejores propuestas para ganar el trabajo."
                                : "Explora la demanda actual de servicios en el mercado."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Client Guidance Banner - Refined */}
            {user?.role === 'CLIENT' && (
                <Alert className="border-blue-200/50 bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm rounded-2xl">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-900 dark:text-blue-300 font-semibold ml-2">Vista de Mercado</AlertTitle>
                    <AlertDescription className="text-blue-800 dark:text-blue-400/80 ml-2 mt-1 font-medium">
                        Estas son solicitudes activas de otros usuarios. Para crear tu propia solicitud y recibir propuestas, ve a <strong>Mis Solicitudes</strong>.
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                    </div>
                    <p className="text-muted-foreground font-medium animate-pulse">Buscando oportunidades...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {requests.length > 0 ? requests.map((req) => (
                        user?.role === 'PROFESSIONAL' ? (
                            <div key={req.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                                <RichRequestCard
                                    data={req as RequestData}
                                    onClick={() => router.push(`/dashboard/opportunities/${req.id}`)}
                                />
                            </div>
                        ) : (
                            <div key={req.id} className="opacity-90 hover:opacity-100 transition-opacity">
                                <TeaserCard data={req} />
                            </div>
                        )
                    )) : (
                        <div className="col-span-full">
                            <StandardizedEmptyState
                                icon={Search}
                                title="No hay oportunidades disponibles"
                                description="Por el momento no hay solicitudes activas en tu categoría o zona. ¡Vuelve a intentar pronto!"
                                action={{
                                    label: "Actualizar Listado",
                                    onClick: () => window.location.reload(),
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
