"use client"

import { useMemo } from "react"
import { useAuth } from "@/providers/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock } from "lucide-react"
import Link from "next/link"

export function TrialAlert() {
  const { user } = useAuth()

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

  // Don't show if not on trial
  if (!user || user.subscriptionStatus !== "trial" || !user.subscriptionEndsAt || daysRemaining <= 0) {
    return null
  }

  return (
    <Alert className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
      <Sparkles className="h-4 w-4 text-emerald-600" />
      <AlertTitle className="text-emerald-900">
        ¡Disfrutá tu mes gratis! 🎉
      </AlertTitle>
      <AlertDescription className="text-emerald-700 mt-2">
        <div className="flex items-center justify-between gap-4">
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
