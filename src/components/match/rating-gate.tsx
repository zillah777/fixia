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
  }, [matchId, clientId, providerId, isClient, onBothRated, refreshTrigger])

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
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ¡Ambos han calificado! Este match está cerrado.
        </AlertDescription>
      </Alert>
    )
  }

  const otherName = isClient ? "Profesional" : "Cliente"
  const otherUserName = isClient
    ? "el profesional"
    : "el cliente"

  return (
    <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="space-y-2">
        {/* Current user status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {userHasRated ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Tú: ✓ Has calificado</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">Necesitas calificar a {otherUserName}</span>
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
                // Force re-fetch of ratings after successful submission
                setUserHasRated(true)
              }}
              trigger={
                <Button size="sm" className="text-xs px-2 h-7">
                  Calificar
                </Button>
              }
            />
          )}
        </div>

        {/* Other user status */}
        <div className="flex items-center gap-2 text-sm">
          {isClient ? (
            <>
              {providerHasRated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Profesional: ✓ Ha calificado</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800">Profesional: ⏳ Pendiente</span>
                </>
              )}
            </>
          ) : (
            <>
              {clientHasRated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-green-800">Cliente: ✓ Ha calificado</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800">Cliente: ⏳ Pendiente</span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
