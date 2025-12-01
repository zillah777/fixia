"use client"

import { useState } from "react"
import { MarketplaceRequestCard, MarketplaceRequestData } from "@/components/marketplace/marketplace-request-card"
import { ProposalDialog } from "@/components/marketplace/proposal-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MapPin } from "lucide-react"

// Mock Data
const MOCK_REQUESTS: MarketplaceRequestData[] = [
    {
        id: "1",
        title: "Instalación de Aire Acondicionado Split 3000f",
        category: "Climatización",
        budget: { min: 40000, max: 55000 },
        location: "Belgrano, CABA",
        date: "Lo antes posible",
        urgency: "HIGH",
        proposalsCount: 2,
        distance: "2.5 km"
    },
    {
        id: "2",
        title: "Cambio de cableado eléctrico en cocina",
        category: "Electricidad",
        budget: { min: 30000, max: 45000 },
        location: "Palermo, CABA",
        date: "Esta semana",
        urgency: "MEDIUM",
        proposalsCount: 5,
        distance: "1.2 km"
    },
    {
        id: "3",
        title: "Pintura completa departamento 2 ambientes",
        category: "Pintura",
        budget: { min: 150000, max: 200000 },
        location: "Recoleta, CABA",
        date: "Próximo mes",
        urgency: "LOW",
        proposalsCount: 8,
        distance: "3.8 km"
    },
    {
        id: "4",
        title: "Reparación de pérdida de agua en baño",
        category: "Plomería",
        budget: { min: 20000, max: 35000 },
        location: "Colegiales, CABA",
        date: "Urgente",
        urgency: "HIGH",
        proposalsCount: 1,
        distance: "0.8 km"
    }
]

export default function MarketplacePage() {
    const [selectedRequest, setSelectedRequest] = useState<MarketplaceRequestData | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
                {MOCK_REQUESTS.map((request) => (
                    <MarketplaceRequestCard
                        key={request.id}
                        data={request}
                        onApply={() => handleApply(request)}
                    />
                ))}
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
