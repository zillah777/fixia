"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, MessageCircle, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mis Reservas</h1>
                <p className="text-muted-foreground">Próximos servicios confirmados.</p>
            </div>

            <div className="grid gap-6">
                {/* Upcoming Booking */}
                <Card className="border-none shadow-md overflow-hidden">
                    <div className="bg-green-600 h-2 w-full" />
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Date Box */}
                            <div className="flex flex-col items-center justify-center bg-green-50 text-green-700 p-4 rounded-2xl min-w-[100px]">
                                <span className="text-3xl font-bold">12</span>
                                <span className="text-sm font-medium uppercase">DIC</span>
                                <span className="text-xs mt-1">14:00 HS</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold">Limpieza Profunda de Hogar</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>Av. Libertador 2400, 4B</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-border/50">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="https://ui-avatars.com/api/?name=Maria+Gonzalez" />
                                        <AvatarFallback>MG</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Maria Gonzalez</p>
                                        <p className="text-xs text-muted-foreground">Profesional Verificada</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-green-100 hover:text-green-600">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-blue-100 hover:text-blue-600">
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-center gap-2 min-w-[150px]">
                                <Button className="w-full bg-black text-white hover:bg-black/90 rounded-xl">
                                    Ver Detalles
                                </Button>
                                <Button variant="outline" className="w-full rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Past Booking */}
                <Card className="border-none shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 rounded-2xl min-w-[100px]">
                            <span className="text-3xl font-bold">28</span>
                            <span className="text-sm font-medium uppercase">NOV</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-muted-foreground">Reparación de Fuga</h3>
                            <p className="text-sm text-muted-foreground">Completado • Calificación: 5.0 ★</p>
                        </div>
                        <Button variant="secondary" className="rounded-xl">
                            Volver a Contratar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
