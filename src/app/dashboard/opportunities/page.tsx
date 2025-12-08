"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { TeaserCard } from "@/components/opportunities/teaser-card"
import { CATEGORIES } from "@/config/categories"
import { Loader2, Info, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Oportunidades de Trabajo</h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'PROFESSIONAL'
                            ? "Encuentra nuevos clientes y envía tus presupuestos."
                            : "Explora la demanda actual de servicios."}
                    </p>
                </div>
            </div>

            {/* Client Guidance Banner */}
            {user?.role === 'CLIENT' && (
                <Alert className="border-secondary/20 bg-secondary/5">
                    <Info className="h-4 w-4 text-secondary" />
                    <AlertTitle className="text-blue-900">Vista de Mercado</AlertTitle>
                    <AlertDescription className="text-secondary">
                        Estas son solicitudes activas de otros usuarios. Para crear tu propia solicitud y recibir propuestas, ve a <strong>Mis Solicitudes</strong>.
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.length > 0 ? requests.map((req) => (
                        user?.role === 'PROFESSIONAL' ? (
                            <RichRequestCard
                                key={req.id}
                                data={req as RequestData}
                                onClick={() => router.push(`/dashboard/opportunities/${req.id}`)}
                            />
                        ) : (
                            <TeaserCard key={req.id} data={req} />
                        )
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <Search className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No hay oportunidades disponibles</h3>
                            <p className="text-muted-foreground mb-4">Por el momento no hay solicitudes activas. Vuelve pronto.</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Actualizar
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
