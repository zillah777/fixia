"use client"

import * as React from "react"
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ScheduledService {
    id: string
    title: string
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
    date: Date
    time: string
    duration: string
    professional: {
        name: string
        avatar: string
        rating: number
    }
    location: string
    price: number
    description: string
}

const statusConfig = {
    pending: {
        label: "Pendiente",
        color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
        icon: <AlertCircle className="h-4 w-4" />,
    },
    confirmed: {
        label: "Confirmado",
        color: "bg-secondary/10 dark:bg-blue-900/20 text-secondary dark:text-blue-300",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    "in-progress": {
        label: "En progreso",
        color: "bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    completed: {
        label: "Completado",
        color: "bg-accent/10 dark:bg-green-900/20 text-accent dark:text-accent",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
        label: "Cancelado",
        color: "bg-destructive/10 dark:bg-red-900/20 text-red-800 dark:text-red-300",
        icon: <AlertCircle className="h-4 w-4" />,
    },
}

export function ServiceScheduler() {
    const [services, setServices] = React.useState<ScheduledService[]>([
        {
            id: "1",
            title: "Reparación de cañería",
            status: "confirmed",
            date: new Date(Date.now() + 2 * 24 * 60 * 60000),
            time: "10:00",
            duration: "1 hora",
            professional: {
                name: "Juan García",
                avatar: "/avatars/01.png",
                rating: 4.9,
            },
            location: "Av. Principal 123, San Isidro",
            price: 3500,
            description: "Reparación de tubería rota en cocina",
        },
        {
            id: "2",
            title: "Revisión eléctrica",
            status: "in-progress",
            date: new Date(),
            time: "14:00",
            duration: "2 horas",
            professional: {
                name: "Carlos Rodríguez",
                avatar: "/avatars/02.png",
                rating: 4.8,
            },
            location: "Calle 5 456, La Plata",
            price: 4200,
            description: "Inspección completa del sistema eléctrico",
        },
        {
            id: "3",
            title: "Limpieza profunda",
            status: "completed",
            date: new Date(Date.now() - 7 * 24 * 60 * 60000),
            time: "09:00",
            duration: "3 horas",
            professional: {
                name: "María López",
                avatar: "/avatars/03.png",
                rating: 5,
            },
            location: "Parque 789, Berazategui",
            price: 2800,
            description: "Limpieza del departamento completo",
        },
    ])

    const getGroupedServices = () => {
        return {
            pending: services.filter((s) => s.status === "pending"),
            confirmed: services.filter((s) => s.status === "confirmed"),
            "in-progress": services.filter((s) => s.status === "in-progress"),
            completed: services.filter((s) => s.status === "completed"),
            cancelled: services.filter((s) => s.status === "cancelled"),
        }
    }

    const renderServiceCard = (service: ScheduledService) => {
        const config = statusConfig[service.status]
        const formattedDate = service.date.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
        })

        return (
            <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                        {/* Content */}
                        <div className="flex-1 p-4 sm:p-6">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <h3 className="font-semibold text-lg">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {service.description}
                                    </p>
                                </div>
                                <Badge className={`flex items-center gap-1 ${config.color}`}>
                                    {config.icon}
                                    {config.label}
                                </Badge>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{service.time} ({service.duration})</span>
                                </div>
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{service.location}</span>
                                </div>
                            </div>

                            {/* Professional */}
                            <div className="flex items-center gap-3 py-3 border-t border-b">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={service.professional.avatar} />
                                    <AvatarFallback>{service.professional.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        {service.professional.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        ⭐ {service.professional.rating}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        ${service.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 p-4 border-t sm:border-t-0 sm:border-l bg-muted/30">
                            {service.status === "pending" && (
                                <>
                                    <Button size="sm" className="flex-1">
                                        Confirmar
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1">
                                        Cancelar
                                    </Button>
                                </>
                            )}
                            {service.status === "confirmed" && (
                                <Button size="sm" variant="outline" className="w-full">
                                    Contactar
                                </Button>
                            )}
                            {service.status === "completed" && (
                                <Button size="sm" variant="outline" className="w-full">
                                    Dejar reseña
                                </Button>
                            )}
                            {service.status !== "cancelled" && (
                                <Button size="sm" variant="ghost" className="w-full">
                                    Ver detalles
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const grouped = getGroupedServices()

    return (
        <div className="w-full space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mis Servicios</h2>
                <p className="text-muted-foreground mt-2">
                    Gestiona todos tus servicios programados
                </p>
            </div>

            <Tabs defaultValue="confirmed" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="confirmed" className="relative">
                        Programados
                        {grouped.confirmed.length > 0 && (
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {grouped.confirmed.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="in-progress">En Progreso</TabsTrigger>
                    <TabsTrigger value="completed">Completados</TabsTrigger>
                    <TabsTrigger value="pending">Pendientes</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                </TabsList>

                {Object.entries(grouped).map(([status, statusServices]) => (
                    <TabsContent key={status} value={status} className="space-y-4 mt-6">
                        {statusServices.length > 0 ? (
                            <div className="space-y-4">
                                {statusServices.map((service) =>
                                    renderServiceCard(service)
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-muted-foreground">
                                        No hay servicios {statusConfig[status as keyof typeof statusConfig].label.toLowerCase()}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
