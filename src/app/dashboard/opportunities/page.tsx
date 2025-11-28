"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, DollarSign, Search, Filter } from "lucide-react"
import { ProposalDialog } from "@/components/proposals/proposal-dialog"

// Mock data
const opportunities = [
    {
        id: 1,
        title: "Instalación de Ventilador de Techo",
        category: "Electricidad",
        location: "Palermo, CABA",
        date: "Para mañana",
        budget: 15000,
        description: "Necesito instalar un ventilador de techo en una habitación. El techo es de losa. Ya tengo el ventilador.",
        tags: ["Electricidad", "Instalación"],
        isNew: true,
    },
    {
        id: 2,
        title: "Reparación de Pérdida en Baño",
        category: "Plomería",
        location: "Belgrano, CABA",
        date: "Urgente",
        budget: 25000,
        description: "Hay una gotera constante en la bacha del baño principal. Necesito reparación urgente.",
        tags: ["Plomería", "Urgencia"],
        isNew: true,
    },
    {
        id: 3,
        title: "Pintura de Departamento 2 Ambientes",
        category: "Pintura",
        location: "Caballito, CABA",
        date: "Próxima semana",
        budget: 120000,
        description: "Busco pintor para departamento de 45m2. Paredes y cielorrasos. Pintura blanca.",
        tags: ["Pintura", "Interior"],
        isNew: false,
    },
]

export default function OpportunitiesPage() {
    const [filter, setFilter] = useState("")

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Oportunidades</h2>
                    <p className="text-muted-foreground">Encuentra nuevos trabajos que coincidan con tu perfil.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título, zona o categoría..."
                        className="pl-9"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="electricidad">Electricidad</SelectItem>
                        <SelectItem value="plomeria">Plomería</SelectItem>
                        <SelectItem value="gasista">Gasista</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Feed */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opp) => (
                    <Card key={opp.id} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={opp.isNew ? "default" : "secondary"}>
                                    {opp.category}
                                </Badge>
                                {opp.isNew && <span className="text-xs font-bold text-primary animate-pulse">NUEVO</span>}
                            </div>
                            <CardTitle className="text-lg leading-tight">{opp.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4 text-sm">
                            <p className="text-muted-foreground line-clamp-3">
                                {opp.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="truncate">{opp.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{opp.date}</span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-foreground">
                                        Presupuesto: ${opp.budget.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <ProposalDialog
                                requestId={opp.id.toString()}
                                requestTitle={opp.title}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
