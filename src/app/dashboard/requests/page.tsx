"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { useRouter } from "next/navigation"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"

import { useState, useEffect } from "react"
import { CATEGORIES } from "@/config/categories"

import { RequestsListHelp } from "@/components/onboarding/form-help-context"

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
        <div className="space-y-8 pb-20 md:pb-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white/50 dark:bg-card/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/20 shadow-xl shadow-stone-200/50 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <RequestsListHelp />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">Mis Solicitudes</h1>
                        <p className="text-muted-foreground font-medium max-w-2xl text-base">
                            Gestiona tus pedidos activos, revisa propuestas y contrata al mejor profesional.
                        </p>
                    </div>
                    <Link href="/create-request">
                        <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg shadow-black/10 transition-transform hover:scale-105 active:scale-95 h-12 px-6 font-bold">
                            <Plus className="mr-2 h-5 w-5" />
                            <span className="hidden md:inline">Crear Solicitud</span>
                            <span className="md:hidden">Crear</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[240px] bg-stone-100 dark:bg-muted/50 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((request) => (
                        <div key={request.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                            <RichRequestCard
                                data={request}
                                onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                                onDelete={(id) => setRequests(requests.filter(r => r.id !== id))}
                            />
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && requests.length === 0 && (
                <div className="mt-8">
                    <StandardizedEmptyState
                        icon={Plus}
                        title="No tienes solicitudes activas"
                        description="Crea tu primera solicitud para encontrar profesionales verificados y obtener presupuestos."
                        action={{
                            label: "Crear Solicitud",
                            onClick: () => router.push("/create-request"),
                        }}
                    />
                </div>
            )}
        </div>
    )
}
