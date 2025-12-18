"use client"

import { useMemo, useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, X } from "lucide-react"
import Link from "next/link"

export function TrialAlert() {
  const { user } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user preference on mount
  useEffect(() => {
    async function fetchPreference() {
      try {
        const res = await fetch("/api/user/preferences")
        if (res.ok) {
          const prefs = await res.json()
          setIsDismissed(prefs.dismissedTrialAlert || false)
        }
      } catch (error) {
        console.error("Error fetching preferences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchPreference()
    }
  }, [user])

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    if (!user || user.subscriptionStatus !== "trial" || !user.subscriptionEndsAt) {
      return 0
    }

    const now = new Date()
    const endDate = new Date(user.subscriptionEndsAt)
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return Math.max(0, daysLeft)
  }, [user])

  // Handle dismiss
  const handleDismiss = async () => {
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismissedTrialAlert: true })
      })

      if (res.ok) {
        setIsDismissed(true)
      }
    } catch (error) {
      console.error("Error dismissing alert:", error)
    }
  }

  // Don't show if: not on trial, dismissed, expired, or loading
  if (
    isLoading ||
    !user ||
    user.subscriptionStatus !== "trial" ||
    !user.subscriptionEndsAt ||
    daysRemaining <= 0 ||
    isDismissed
  ) {
    return null
  }

  return (
    <Alert className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200 relative">
      {/* Botón de cerrar */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-emerald-600 hover:text-emerald-800 transition-colors"
        aria-label="Cerrar anuncio"
      >
        <X className="h-4 w-4" />
      </button>

      <Sparkles className="h-4 w-4 text-emerald-600" />
      <AlertTitle className="text-emerald-900">
        ¡Disfrutá tu mes gratis! 🎉
      </AlertTitle>
      <AlertDescription className="text-emerald-700 mt-2">
        <div className="flex items-center justify-between gap-4 pr-6">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Te quedan <strong>{daysRemaining} {daysRemaining === 1 ? "día" : "días"}</strong> de acceso completo
            </span>
          </span>
          <Button variant="outline" size="sm" className="text-emerald-700 border-emerald-200 hover:bg-emerald-100" asChild>
            <Link href="/dashboard/subscription">
              Ver detalles
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
