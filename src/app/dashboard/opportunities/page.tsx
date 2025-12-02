"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, DollarSign, Search, Filter, Loader2 } from "lucide-react"
import { ProposalDialog } from "@/components/proposals/proposal-dialog"
import { toast } from "sonner"

export default function OpportunitiesPage() {
    const [filter, setFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [opportunities, setOpportunities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOpportunities()
    }, [])

    const fetchOpportunities = async () => {
        try {
            const res = await fetch("/api/requests?mode=marketplace")
            if (res.ok) {
                const data = await res.json()
                setOpportunities(data)
            } else {
                toast.error("Error al cargar oportunidades")
            }
        } catch (error) {
            console.error("Failed to fetch opportunities", error)
            toast.error("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    const filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch =
            opp.title.toLowerCase().includes(filter.toLowerCase()) ||
            opp.description?.toLowerCase().includes(filter.toLowerCase()) ||
            opp.location.toLowerCase().includes(filter.toLowerCase())

        const matchesCategory = categoryFilter === "all" || opp.categoryId.toLowerCase() === categoryFilter.toLowerCase()

        return matchesSearch && matchesCategory
    })

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
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título, zona o categoría..."
                        className="pl-9"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="electricidad">Electricidad</SelectItem>
                        <SelectItem value="plomeria">Plomería</SelectItem>
                        <SelectItem value="gasista">Gasista</SelectItem>
                        <SelectItem value="pintura">Pintura</SelectItem>
                        <SelectItem value="carpinteria">Carpintería</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Feed */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOpportunities.length > 0 ? (
                        filteredOpportunities.map((opp) => (
                            <Card key={opp.id} className="flex flex-col hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary">
                                            {opp.categoryId}
                                        </Badge>
                                        {/* Logic for "New" could be based on createdAt date */}
                                        {new Date(opp.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                                            <span className="text-xs font-bold text-primary animate-pulse">NUEVO</span>
                                        )}
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
                                            <span>{new Date(opp.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 col-span-2">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span className="font-semibold text-foreground">
                                                Presupuesto: {opp.budget ? `$${Number(opp.budget).toLocaleString()}` : "A convenir"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <ProposalDialog
                                        requestId={opp.id}
                                        requestTitle={opp.title}
                                    />
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No se encontraron oportunidades disponibles.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
