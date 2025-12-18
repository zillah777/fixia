"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RatingGateProps {
  matchId: string
  clientId: string
  providerId: string
  currentUserId: string
  onBothRated?: () => void
  refreshTrigger?: number // External trigger to force refresh
}

export function RatingGate({
  matchId,
  clientId,
  providerId,
  currentUserId,
  onBothRated,
  refreshTrigger,
}: RatingGateProps) {
  const [loading, setLoading] = useState(true)
  const [userHasRated, setUserHasRated] = useState(false)
  const [clientHasRated, setClientHasRated] = useState(false)
  const [providerHasRated, setProviderHasRated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasTriggeredCallback, setHasTriggeredCallback] = useState(false)

  const isClient = currentUserId === clientId
  const isProvider = currentUserId === providerId

  // Fetch rating status on mount and periodically
  useEffect(() => {
    const checkRatings = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/reviews?matchId=${matchId}`, {
          cache: 'no-store', // Prevent caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.status}`)
        }

        const reviews = await res.json()

        if (!Array.isArray(reviews)) {
          throw new Error("Invalid reviews data format")
        }

        // Check if each party has reviewed
        const clientReviewed = reviews.some((r: any) => r.authorId === clientId)
        const providerReviewed = reviews.some((r: any) => r.authorId === providerId)

        setClientHasRated(clientReviewed)
        setProviderHasRated(providerReviewed)
        setUserHasRated(isClient ? clientReviewed : providerReviewed)

        // Call onBothRated if both have rated (only once)
        if (clientReviewed && providerReviewed && onBothRated && !hasTriggeredCallback) {
          setHasTriggeredCallback(true)
          toast.success("¡Ambos han calificado! Match cerrado.")
          onBothRated()
        }
      } catch (error) {
        console.error("Error checking ratings:", error)
        setError(error instanceof Error ? error.message : "Error loading reviews")
      } finally {
        setLoading(false)
      }
    }

    checkRatings()

    // Poll every 3 seconds to check if other user has rated
    const interval = setInterval(checkRatings, 3000)
    return () => clearInterval(interval)
  }, [matchId, clientId, providerId, isClient, onBothRated, refreshTrigger, hasTriggeredCallback])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // If both have rated, show success message
  if (clientHasRated && providerHasRated) {
    return (
      <div className="relative overflow-hidden rounded-xl border" style={{
        backgroundColor: '#f0f4ed',
        borderColor: '#788c5d'
      }}>
        <div className="absolute inset-0 opacity-5" style={{
          background: 'linear-gradient(135deg, #788c5d, transparent)'
        }} />
        <div className="relative flex items-start gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#788c5d' }} />
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: '#2d3d24' }}>
              ¡Ambos han calificado!
            </p>
            <p className="text-xs mt-1" style={{ color: '#5a6b4a' }}>
              Este match ha sido completado y cerrado correctamente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const otherName = isClient ? "Profesional" : "Cliente"
  const otherUserName = isClient
    ? "el profesional"
    : "el cliente"

  return (
    <div className="rounded-xl border overflow-hidden" style={{
      backgroundColor: '#fafaf8',
      borderColor: '#e8e6dc'
    }}>
      <div className="h-1 w-full" style={{ backgroundColor: '#788c5d' }} />

      <div className="p-4 space-y-4">
        {/* Current user status */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {userHasRated ? (
              <>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#788c5d' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Has calificado</p>
                  <p className="text-xs" style={{ color: '#788c5d' }}>Gracias por tu reseña</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#d4a574' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Califica a {otherUserName}</p>
                  <p className="text-xs" style={{ color: '#888888' }}>Tu opinión es importante</p>
                </div>
              </>
            )}
          </div>

          {/* Show rating button if user hasn't rated yet */}
          {!userHasRated && (
            <ReviewDialog
              matchId={matchId}
              targetName={otherName}
              targetId={isClient ? providerId : clientId}
              onSuccess={() => {
                setUserHasRated(true)
              }}
              trigger={
                <Button
                  size="sm"
                  className="text-xs px-4 h-8 font-semibold whitespace-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: '#788c5d',
                    color: 'white'
                  }}
                >
                  Calificar
                </Button>
              }
            />
          )}
        </div>

        {/* Other user status */}
        <div className="flex items-start gap-3 pt-2 border-t" style={{ borderColor: '#e8e6dc' }}>
          {isClient ? (
            <>
              {providerHasRated ? (
                <>
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#788c5d' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Profesional ha calificado</p>
                    <p className="text-xs" style={{ color: '#788c5d' }}>Reseña completada</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f0f0' }}>
                    <span className="text-xs" style={{ color: '#999999' }}>⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Profesional: Pendiente</p>
                    <p className="text-xs" style={{ color: '#888888' }}>Esperando su calificación</p>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {clientHasRated ? (
                <>
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#788c5d' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Cliente ha calificado</p>
                    <p className="text-xs" style={{ color: '#788c5d' }}>Reseña completada</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f0f0' }}>
                    <span className="text-xs" style={{ color: '#999999' }}>⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#2d3d24' }}>Cliente: Pendiente</p>
                    <p className="text-xs" style={{ color: '#888888' }}>Esperando su calificación</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
