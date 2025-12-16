"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Search, ArrowLeft } from "lucide-react"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import Link from "next/link"

interface Service {
    id: string
    title: string
    description: string
    price: number
    category: string
    provider: {
        id: string
        name: string
        avatar?: string
        rating: number
    }
}

export default function CategoryServicesPage() {
    const params = useParams()
    const category = params?.category as string
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (category) {
            fetchServices()
        }
    }, [category, search])

    const fetchServices = async () => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            queryParams.append("category", category)
            if (search) queryParams.append("search", search)

            const res = await fetch(`/api/public/services?${queryParams.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }

    const categoryNames: Record<string, string> = {
        plomeria: "Plomería",
        electricidad: "Electricidad",
        gas: "Gasista",
        pintura: "Pintura",
        carpinteria: "Carpintería",
        fletes: "Fletes",
        belleza: "Belleza",
        tecnologia: "Tecnología",
        jardineria: "Jardinería",
        albanileria: "Albañilería"
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a categorías
                </Link>
                <h1 className="text-4xl font-bold mb-2">
                    {categoryNames[category] || category}
                </h1>
                <p className="text-muted-foreground text-lg">
                    Servicios disponibles en esta categoría
                </p>
            </div>

            {/* Search */}
            <div className="mb-8 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar servicios..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Services Grid */}
            {loading ? (
                <div className="text-center py-12">Cargando servicios...</div>
            ) : services.length === 0 ? (
                <StandardizedEmptyState
                    icon={Search}
                    title="No hay servicios disponibles"
                    description="Por el momento no hay servicios en esta categoría. Vuelve más tarde o explora otras categorías."
                    action={{
                        label: "Ver todas las categorías",
                        onClick: () => window.location.href = "/services",
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardHeader className="p-0">
                                <div className="h-48 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                                    <div className="text-white text-center p-6">
                                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    {service.description}
                                </p>

                                {/* Provider Info */}
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={service.provider.avatar || `https://ui-avatars.com/api/?name=${service.provider.name}&background=random`}
                                        />
                                        <AvatarFallback>{service.provider.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{service.provider.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {service.provider.rating.toFixed(1)}
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold">
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(service.price)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">por servicio</span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4">
                                <Link href={`/professionals/${service.provider.id}`} className="w-full">
                                    <Button className="w-full">Ver Profesional</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
