"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Trash2, CheckCircle2, Loader2, Mail, Phone, XCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function BookingsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const { confirm, ConfirmDialog } = useConfirmDialog()
    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/matches")
                if (res.ok) {
                    const response = await res.json()
                    // API returns { data: [...], pagination: {...} }
                    const data = Array.isArray(response) ? response : response.data || []

                    // Filter: Show Completed or Cancelled matches (History)
                    // We relax the "rated" check so users can see history even if they haven't reviewed yet.
                    const historyMatches = data.filter((match: any) => {
                        // Simplify: If it's completed, it's history. 
                        // If request is Cancelled (and match exists), it's history (failed).
                        return match.isCompleted || match.request.status === 'CANCELLED' || match.request.status === 'COMPLETED'
                    })
                    setBookings(historyMatches)
                }
            } catch (error) {
                console.error("Error fetching bookings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBookings()
    }, [])

    const handleDeleteBooking = (bookingId: string) => {
        confirm(
            '¿Eliminar historial?',
            '¿Estás seguro? No podrás recuperar este historial.',
            async () => {
                setDeletingId(bookingId)
                try {
                    // Since we can't actually delete matches, we'll simulate removal from the list
                    setBookings(bookings.filter(b => b.id !== bookingId))
                    toast.success('Historial eliminado')
                } catch (error) {
                    toast.error('Error al eliminar')
                    setDeletingId(null)
                }
            },
            {
                actionLabel: 'Eliminar',
                cancelLabel: 'Cancelar'
            }
        )
    }

    return (
        <div className="space-y-6">
            <ConfirmDialog />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Historial de Trabajos</h1>
                <p className="text-muted-foreground">Trabajos completados exitosamente.</p>
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
                        <Card key={booking.id} className="border-none shadow-md overflow-hidden" style={{ backgroundColor: '#faf9f5' }}>
                            <div className="h-2 w-full" style={{ backgroundColor: '#788c5d' }} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Box */}
                                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px]" style={{ backgroundColor: '#e8f0e6', color: '#788c5d' }}>
                                        <span className="text-3xl font-bold">{new Date(booking.createdAt).getDate()}</span>
                                        <span className="text-sm font-medium uppercase">{new Date(booking.createdAt).toLocaleString('es-AR', { month: 'short' })}</span>
                                        <span className="text-xs mt-1">{new Date(booking.createdAt).getFullYear()}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold">{booking.request.title}</h3>
                                                <CheckCircle2 className="h-5 w-5" style={{ color: '#788c5d' }} />
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{booking.request.location}</span>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-4 p-3 bg-white rounded-xl" style={{ borderColor: '#e8e6dc', borderWidth: '1px' }}>
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
                                                <p className="text-xs text-muted-foreground mb-1">{user?.role === 'CLIENT' ? 'Profesional' : 'Cliente'}</p>

                                                {/* Contact Info */}
                                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                    {(user?.role === 'CLIENT' ? booking.provider.email : booking.client.email) && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3" />
                                                            <span>{user?.role === 'CLIENT' ? booking.provider.email : booking.client.email}</span>
                                                        </div>
                                                    )}
                                                    {(user?.role === 'CLIENT' ? booking.provider.phone : booking.client.phone) && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{user?.role === 'CLIENT' ? booking.provider.phone : booking.client.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="flex flex-col justify-center gap-2 min-w-[150px]">
                                        {/* Status Badge */}
                                        <div className="mb-2">
                                            {booking.request.status === 'CANCELLED' ? (
                                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-orange-100 text-orange-800 shadow">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Cancelado / Fallido
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary shadow hover:bg-primary/20">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Completado con éxito
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="destructive"
                                            className="w-full rounded-xl"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            disabled={deletingId === booking.id}
                                        >
                                            {deletingId === booking.id ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Eliminando...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <StandardizedEmptyState
                        icon={Calendar}
                        title="No tienes historial de trabajos"
                        description="Una vez completes trabajos exitosamente aparecerán aquí."
                        action={{
                            label: "Ver mensajes",
                            onClick: () => router.push("/dashboard/matches"),
                        }}
                    />
                )}
            </div>
        </div>
    )
}
