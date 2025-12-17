"use client"

import React from "react"
import { CheckCircle2, Award, Zap, Lock, Heart, Flame, ShieldCheck, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

// Map DB badge strings to internal variant names
export const BADGE_MAPPING: Record<string, "verified" | "expert" | "fast" | "trending"> = {
  "VERIFIED": "verified",
  "EXPERT": "expert",
  "FAST": "fast",
  "TRENDING": "trending"
}

interface TrustBadgeProps {
  variant?: "verified" | "expert" | "fast" | "secure" | "favorite" | "trending"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
  animate?: boolean
}

const badgeConfig = {
  verified: {
    icon: ShieldCheck,
    label: "Verificado",
    // Premium Blue/Cyan Gradient
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    textClass: "text-blue-700 dark:text-blue-300",
    bgClass: "bg-blue-50 dark:bg-blue-950/40",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconColor: "text-white",
  },
  expert: {
    icon: Trophy,
    label: "Experto",
    // Premium Gold/Amber Gradient
    gradient: "bg-gradient-to-r from-amber-400 to-orange-500",
    textClass: "text-amber-800 dark:text-amber-300",
    bgClass: "bg-amber-50 dark:bg-amber-950/40",
    borderClass: "border-amber-200 dark:border-amber-800",
    iconColor: "text-white",
  },
  fast: {
    icon: Zap,
    label: "Rayo",
    // Premium Electric Purple/Violet Gradient
    gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    textClass: "text-violet-800 dark:text-violet-300",
    bgClass: "bg-violet-50 dark:bg-violet-950/40",
    borderClass: "border-violet-200 dark:border-violet-800",
    iconColor: "text-white",
  },
  trending: {
    icon: Flame,
    label: "Trending",
    // Premium Red/Orange Gradient
    gradient: "bg-gradient-to-r from-rose-500 to-orange-500",
    textClass: "text-rose-800 dark:text-rose-300",
    bgClass: "bg-rose-50 dark:bg-rose-950/40",
    borderClass: "border-rose-200 dark:border-rose-800",
    iconColor: "text-white",
  },
  secure: { // Utility badge, kept simpler
    icon: Lock,
    label: "Seguro",
    gradient: "bg-stone-500",
    textClass: "text-stone-600",
    bgClass: "bg-stone-100",
    borderClass: "border-stone-200",
    iconColor: "text-white",
  },
  favorite: {
    icon: Heart,
    label: "Favorito",
    gradient: "bg-pink-500",
    textClass: "text-pink-600",
    bgClass: "bg-pink-50",
    borderClass: "border-pink-200",
    iconColor: "text-white",
  }
}

const sizeConfig = {
  sm: { container: "px-2 py-0.5 text-[10px]", icon: "h-3 w-3" },
  md: { container: "px-3 py-1 text-xs", icon: "h-3.5 w-3.5" },
  lg: { container: "px-4 py-1.5 text-sm", icon: "h-4 w-4" },
}

export function TrustBadge({
  variant = "verified",
  size = "md",
  showLabel = true,
  className,
  animate = true
}: TrustBadgeProps) {
  const config = badgeConfig[variant]
  const Icon = config.icon
  const sizes = sizeConfig[size]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-all duration-300 select-none group",
        config.bgClass,
        config.borderClass,
        sizes.container,
        animate && "hover:scale-105 hover:shadow-md",
        className
      )}
      title={config.label}
    >
      {/* Icon Circle */}
      <div className={cn(
        "rounded-full p-0.5 flex items-center justify-center shadow-sm",
        config.gradient
      )}>
        <Icon className={cn(sizes.icon, config.iconColor)} strokeWidth={2.5} />
      </div>

      {showLabel && (
        <span className={cn("font-bold tracking-tight", config.textClass)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

interface TrustBadgesGroupProps {
  badges: string[] // Expecting DB strings like "VERIFIED", "EXPERT"
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
  className?: string
}

export function TrustBadgesGroup({
  badges,
  size = "sm",
  showLabels = true,
  className,
}: TrustBadgesGroupProps) {
  // Filter only valid badges
  const validBadges = badges
    .map(b => BADGE_MAPPING[b])
    .filter(Boolean)

  if (validBadges.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {validBadges.map((badge, idx) => (
        <TrustBadge
          key={`${badge}-${idx}`}
          variant={badge}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  )
}
