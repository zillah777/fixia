"use client"

import { useState, useEffect } from "react"
import { MarketplaceRequestCard, MarketplaceRequestData } from "@/components/marketplace/marketplace-request-card"
import { ProposalDialog } from "@/components/marketplace/proposal-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MapPin } from "lucide-react"

export default function MarketplacePage() {
    const [selectedRequest, setSelectedRequest] = useState<MarketplaceRequestData | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [requests, setRequests] = useState<MarketplaceRequestData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch("/api/requests?mode=marketplace")
                if (res.ok) {
                    const data = await res.json()
                    const formattedRequests = data.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        category: r.category?.name || "General",
                        budget: { min: Number(r.budget) * 0.8, max: Number(r.budget) }, // Estimating range from single budget
                        location: r.location,
                        date: r.datePreference || "Sin fecha",
                        urgency: r.urgency,
                        proposalsCount: r._count?.proposals || 0,
                        distance: "Unknown" // Need geolocation for this
                    }))
                    setRequests(formattedRequests)
                }
            } catch (error) {
                console.error("Error fetching marketplace requests:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRequests()
    }, [])

    const handleApply = (request: MarketplaceRequestData) => {
        setSelectedRequest(request)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explorar Solicitudes</h1>
                    <p className="text-muted-foreground">Encuentra nuevos trabajos cerca de ti.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar trabajos..." className="pl-10 rounded-full bg-white" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full shrink-0">
                        <MapPin className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[250px] bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map((request) => (
                            <MarketplaceRequestCard
                                key={request.id}
                                data={request}
                                onApply={() => handleApply(request)}
                            />
                        ))}
                        {!isLoading && requests.length === 0 && (
                            <div className="col-span-full text-center py-20 text-muted-foreground">
                                No hay solicitudes disponibles en este momento.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedRequest && (
                <ProposalDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    requestTitle={selectedRequest.title}
                />
            )}
        </div>
    )
}
