"use client"

import React from "react"
import { Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps {
  tier?: "gold" | "platinum" | "diamond"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

const tierConfig = {
  gold: {
    icon: Crown,
    label: "Premium",
    color: "from-amber-400 to-yellow-500",
    text: "text-amber-900",
    border: "border-amber-200",
  },
  platinum: {
    icon: Sparkles,
    label: "Platino",
    color: "from-slate-300 to-slate-400",
    text: "text-slate-900",
    border: "border-slate-200",
  },
  diamond: {
    icon: Crown,
    label: "Diamante",
    color: "from-secondary to-primary",
    text: "text-foreground",
    border: "border-secondary/20",
  },
}

const sizeConfig = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
}

export function PremiumBadge({
  tier = "gold",
  size = "md",
  animated = true,
  className,
}: PremiumBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2",
        "bg-gradient-to-r",
        config.color,
        config.border,
        "shadow-lg shadow-current/20",
        animated && "animate-pulse",
        className
      )}
    >
      <div className={cn("flex items-center gap-1.5", sizeConfig[size])}>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className={cn("font-bold whitespace-nowrap", config.text)}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
