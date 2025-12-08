"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, MessageCircle, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function BookingsPage() {
    const { user } = useAuth()
    const router = useRouter()
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

    const handleWhatsApp = (booking: any) => {
        const otherUser = user?.role === 'CLIENT' ? booking.provider : booking.client
        const phone = otherUser?.phone
        if (phone) {
            window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank')
        }
    }

    const handleChat = (bookingId: string) => {
        router.push(`/dashboard/matches/${bookingId}`)
    }

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
                            <div className={`${booking.isCompleted ? 'bg-gray-400' : 'bg-accent'} h-2 w-full`} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Box */}
                                    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px] ${booking.isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-accent/5 text-accent'}`}>
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
                                                <AvatarImage src={
                                                    user?.role === 'CLIENT'
                                                        ? (booking.provider.avatar || `https://ui-avatars.com/api/?name=${booking.provider.name}&background=random`)
                                                        : (booking.client.avatar || `https://ui-avatars.com/api/?name=${booking.client.name}&background=random`)
                                                } />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{user?.role === 'CLIENT' ? booking.provider.name : booking.client.name}</p>
                                                <p className="text-xs text-muted-foreground">{user?.role === 'CLIENT' ? 'Profesional' : 'Cliente'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="rounded-full hover:bg-accent/10 hover:text-accent"
                                                    onClick={() => handleWhatsApp(booking)}
                                                    title="Contactar por WhatsApp"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="rounded-full hover:bg-secondary/10 hover:text-secondary"
                                                    onClick={() => handleChat(booking.id)}
                                                    title="Abrir chat"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-2 min-w-[150px]">
                                        <Button
                                            className="w-full bg-black text-white hover:bg-black/90 rounded-xl"
                                            onClick={() => handleChat(booking.id)}
                                        >
                                            Ver Detalles
                                        </Button>
                                        {!booking.isCompleted && (
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/5 border-red-100"
                                                onClick={() => {
                                                    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                                                        toast.error('Función de cancelación en desarrollo')
                                                    }
                                                }}
                                            >
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
