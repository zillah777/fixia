"use client"

import React from "react"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Pause,
  Rocket,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "pending" | "warning" | "error" | "paused" | "launching"
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

const statusConfig = {
  active: {
    icon: CheckCircle2,
    label: "Activo",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-accent/5 dark:bg-accent/20",
    borderColor: "border-accent/20 dark:border-accent/30",
    dotColor: "bg-accent/50",
  },
  pending: {
    icon: Clock,
    label: "Pendiente",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    dotColor: "bg-amber-500",
  },
  warning: {
    icon: AlertCircle,
    label: "Atención",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    dotColor: "bg-orange-500",
  },
  error: {
    icon: XCircle,
    label: "Error",
    color: "text-destructive dark:text-red-400",
    bgColor: "bg-destructive/5 dark:bg-red-950/30",
    borderColor: "border-destructive/20 dark:border-red-800",
    dotColor: "bg-destructive",
  },
  paused: {
    icon: Pause,
    label: "Pausado",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    borderColor: "border-slate-200 dark:border-slate-800",
    dotColor: "bg-slate-500",
  },
  launching: {
    icon: Rocket,
    label: "Lanzando",
    color: "text-primary dark:text-accent",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    borderColor: "border-primary/20 dark:border-primary/30",
    dotColor: "bg-accent",
  },
}

const sizeConfig = {
  sm: "text-xs px-2.5 py-1.5",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-2.5",
}

export function StatusBadge({
  status,
  showLabel = true,
  size = "md",
  animated = false,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border transition-all",
        config.bgColor,
        config.borderColor,
        sizeConfig[size],
        "hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", config.dotColor, animated && "animate-pulse")} />
        <Icon className={cn("flex-shrink-0 h-4 w-4", config.color)} />
      </div>
      {showLabel && <span className={cn("font-semibold", config.color)}>{config.label}</span>}
    </div>
  )
}
