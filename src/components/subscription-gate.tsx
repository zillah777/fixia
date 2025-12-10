"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Crown } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

interface SubscriptionGateProps {
  children: ReactNode
  feature: string
  fallback?: ReactNode
  subscriptionStatus?: string | null
  subscriptionEndsAt?: string | null
}

export function SubscriptionGate({
  children,
  feature,
  fallback,
  subscriptionStatus,
  subscriptionEndsAt
}: SubscriptionGateProps) {
  const hasActiveSubscription = subscriptionStatus === "active" &&
    subscriptionEndsAt &&
    new Date(subscriptionEndsAt) > new Date()

  if (!hasActiveSubscription) {
    return fallback || (
      <Card className="p-8 text-center border-dashed border-2">
        <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Función Premium</h3>
        <p className="text-muted-foreground mb-4">
          {feature} está disponible solo para profesionales con suscripción activa.
        </p>
        <Link href="/dashboard/subscription">
          <Button className="gap-2">
            <Lock className="h-4 w-4" />
            Activar Suscripción
          </Button>
        </Link>
      </Card>
    )
  }

  return <>{children}</>
}
