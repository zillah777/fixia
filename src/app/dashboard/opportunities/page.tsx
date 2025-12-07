"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { TeaserCard } from "@/components/opportunities/teaser-card"
import { CATEGORIES } from "@/config/categories"
import { Loader2 } from "lucide-react"

import { useRouter } from "next/navigation"

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
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No hay oportunidades disponibles por el momento.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
