"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RichRequestCard, RequestData } from "@/components/requests/rich-request-card"
import { useRouter } from "next/navigation"

// Mock Data
const MOCK_REQUESTS: RequestData[] = [
    {
        id: "1",
        title: "Reparación de Aire Acondicionado Split",
        category: "Climatización",
        status: "OPEN",
        budget: { min: 25000, max: 35000, currency: "ARS" },
        location: "Belgrano, CABA",
        date: "Mañana por la tarde",
        urgency: "HIGH",
        proposalsCount: 5
    },
    {
        id: "2",
        title: "Instalación de Luminarias LED en Cocina",
        category: "Electricidad",
        status: "COMPLETED",
        budget: { min: 15000, max: 20000, currency: "ARS" },
        location: "Palermo, CABA",
        date: "Hace 3 días",
        urgency: "LOW",
        proposalsCount: 3
    },
    {
        id: "3",
        title: "Pintura de Habitación 4x4",
        category: "Pintura",
        status: "IN_PROGRESS",
        budget: { min: 80000, max: 120000, currency: "ARS" },
        location: "Nuñez, CABA",
        date: "Próximo Lunes",
        urgency: "MEDIUM",
        proposalsCount: 8
    }
]

export default function RequestsPage() {
    const router = useRouter()

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_REQUESTS.map((request) => (
                    <RichRequestCard
                        key={request.id}
                        data={request}
                        onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                    />
                ))}
            </div>

            {MOCK_REQUESTS.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No tienes solicitudes activas</h3>
                    <p className="text-muted-foreground mb-6">Crea tu primera solicitud para encontrar profesionales.</p>
                    <Link href="/create-request">
                        <Button variant="outline">Crear Solicitud</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
