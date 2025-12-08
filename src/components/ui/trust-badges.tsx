"use client"

import React from "react"
import { CheckCircle2, Award, Zap, Lock, Heart, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustBadgeProps {
  variant?: "verified" | "expert" | "fast" | "secure" | "favorite" | "trending"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const badgeConfig = {
  verified: {
    icon: CheckCircle2,
    label: "Verificado",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  expert: {
    icon: Award,
    label: "Experto",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  fast: {
    icon: Zap,
    label: "Respuesta Rápida",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  secure: {
    icon: Lock,
    label: "Pago Seguro",
    color: "text-primary dark:text-accent",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    borderColor: "border-primary/20 dark:border-primary/30",
  },
  favorite: {
    icon: Heart,
    label: "Favorito",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
  trending: {
    icon: TrendingUp,
    label: "En Tendencia",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
}

const sizeConfig = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
}

export function TrustBadge({
  variant = "verified",
  size = "md",
  showLabel = false,
  className,
}: TrustBadgeProps) {
  const config = badgeConfig[variant]
  const Icon = config.icon
  const sizeClass = sizeConfig[size]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300",
        config.bgColor,
        config.borderColor,
        "hover:shadow-md hover:scale-105",
        className
      )}
      title={config.label}
    >
      <Icon className={cn("flex-shrink-0", config.color, sizeClass)} />
      {showLabel && (
        <span className={cn("font-semibold whitespace-nowrap", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

interface TrustBadgesGroupProps {
  badges: Array<"verified" | "expert" | "fast" | "secure" | "favorite" | "trending">
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
  className?: string
}

export function TrustBadgesGroup({
  badges,
  size = "sm",
  showLabels = false,
  className,
}: TrustBadgesGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <TrustBadge
          key={badge}
          variant={badge}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  )
}
