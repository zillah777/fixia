"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { useRouter } from "next/navigation"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"



import { useState, useEffect } from "react"
import { CATEGORIES } from "@/config/categories"

export default function RequestsPage() {
    const router = useRouter()
    const [requests, setRequests] = useState<RequestData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch("/api/requests")
                if (res.ok) {
                    const data = await res.json()
                    // Transform data to match RequestData interface
                    const formattedRequests = data.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        description: r.description,
                        category: CATEGORIES.find(c => c.id === r.categoryId)?.label || r.category?.name || "General",
                        status: r.status,
                        budget: {
                            min: Number(r.budget) || 0,
                            max: Number(r.budget) || 0,
                            currency: "ARS"
                        },
                        location: r.location,
                        date: new Date(r.createdAt).toLocaleDateString(),
                        // urgency: r.urgency, // Removed as it's not in DB
                        proposalsCount: r._count?.proposals || 0
                    }))
                    setRequests(formattedRequests)
                }
            } catch (error) {
                console.error("Error fetching requests:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRequests()
    }, [])

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 md:static md:bg-transparent md:p-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
                    <p className="text-sm text-muted-foreground">Gestiona y sigue el estado de tus pedidos.</p>
                </div>
                <Link href="/create-request">
                    <Button className="bg-black text-white hover:bg-black/90 rounded-full shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden md:inline">Nueva Solicitud</span>
                        <span className="md:hidden">Nueva</span>
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[200px] bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((request) => (
                        <RichRequestCard
                            key={request.id}
                            data={request}
                            onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                            onDelete={(id) => setRequests(requests.filter(r => r.id !== id))}
                        />
                    ))}
                </div>
            )}

            {!isLoading && requests.length === 0 && (
                <StandardizedEmptyState
                    icon={Plus}
                    title="No tienes solicitudes activas"
                    description="Crea tu primera solicitud para encontrar profesionales verificados y obtener presupuestos."
                    action={{
                        label: "Crear Solicitud",
                        onClick: () => router.push("/create-request"),
                    }}
                />
            )}
        </div>
    )
}
