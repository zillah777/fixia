"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, MessageCircle, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"

export default function BookingsPage() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/matches")
                if (res.ok) {
                    const data = await res.json()
                    setBookings(data)
                }
            } catch (error) {
                console.error("Error fetching bookings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookings()
    }, [])
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mis Reservas</h1>
                <p className="text-muted-foreground">Próximos servicios confirmados.</p>
            </div>

            <div className="grid gap-6">
                {isLoading ? (
                    [1, 2].map((i) => (
                        <Card key={i} className="border-none shadow-md overflow-hidden animate-pulse">
                            <CardContent className="p-6 h-[200px] bg-gray-100" />
                        </Card>
                    ))
                ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <Card key={booking.id} className={`border-none shadow-md overflow-hidden ${booking.isCompleted ? 'opacity-60 hover:opacity-100 transition-opacity' : ''}`}>
                            <div className={`${booking.isCompleted ? 'bg-gray-400' : 'bg-green-600'} h-2 w-full`} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Box */}
                                    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px] ${booking.isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'}`}>
                                        <span className="text-3xl font-bold">{new Date(booking.createdAt).getDate()}</span>
                                        <span className="text-sm font-medium uppercase">{new Date(booking.createdAt).toLocaleString('es-AR', { month: 'short' })}</span>
                                        {!booking.isCompleted && <span className="text-xs mt-1">{new Date(booking.createdAt).getHours()}:00 HS</span>}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{booking.request.title}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{booking.request.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-border/50">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.role === 'CLIENT' ? booking.provider.name : booking.client.name}&background=random`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{user?.role === 'CLIENT' ? booking.provider.name : booking.client.name}</p>
                                                <p className="text-xs text-muted-foreground">{user?.role === 'CLIENT' ? 'Profesional' : 'Cliente'}</p>
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
                                        {!booking.isCompleted && (
                                            <Button variant="outline" className="w-full rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                                                Cancelar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        No tienes reservas activas.
                    </div>
                )}
            </div>
        </div>
    )
}
