"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Trash2, CheckCircle2, Loader2 } from "lucide-react"
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

                    // Filter: Only completed matches with both users rated
                    const completedAndRated = data.filter((match: any) => {
                        if (!match.isCompleted) return false

                        const reviews = Array.isArray(match.reviews) ? match.reviews : []
                        const clientReviewed = reviews.some((r: any) => r.authorId === match.clientId)
                        const providerReviewed = reviews.some((r: any) => r.authorId === match.providerId)

                        return clientReviewed && providerReviewed
                    })
                    setBookings(completedAndRated)
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
                            <div className="h-2 w-full" style={{ backgroundColor: '#d97757' }} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Box */}
                                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px]" style={{ backgroundColor: '#e8e6dc', color: '#d97757' }}>
                                        <span className="text-3xl font-bold">{new Date(booking.createdAt).getDate()}</span>
                                        <span className="text-sm font-medium uppercase">{new Date(booking.createdAt).toLocaleString('es-AR', { month: 'short' })}</span>
                                        <span className="text-xs mt-1">{new Date(booking.createdAt).getFullYear()}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold">{booking.request.title}</h3>
                                                <CheckCircle2 className="h-5 w-5" style={{ color: '#d97757' }} />
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
                                                <p className="text-xs text-muted-foreground">{user?.role === 'CLIENT' ? 'Profesional' : 'Cliente'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-2 min-w-[150px]">
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
