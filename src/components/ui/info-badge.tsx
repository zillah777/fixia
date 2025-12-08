"use client"

import React from "react"
import { AlertCircle, Info, Check, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoBadgeProps {
  type?: "info" | "success" | "tip" | "warning"
  icon?: React.ReactNode
  text: string
  size?: "sm" | "md" | "lg"
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const typeConfig = {
  info: {
    icon: Info,
    bg: "bg-secondary/5 dark:bg-blue-950/30",
    border: "border-secondary/20 dark:border-blue-800",
    text: "text-secondary dark:text-blue-200",
    dotColor: "bg-secondary",
  },
  success: {
    icon: Check,
    bg: "bg-accent/5 dark:bg-accent/20",
    border: "border-accent/20 dark:border-accent/30",
    text: "text-emerald-800 dark:text-emerald-200",
    dotColor: "bg-accent/50",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    dotColor: "bg-amber-500",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-800 dark:text-orange-200",
    dotColor: "bg-orange-500",
  },
}

const sizeConfig = {
  sm: "px-3 py-2 text-xs gap-2",
  md: "px-4 py-3 text-sm gap-2.5",
  lg: "px-5 py-4 text-base gap-3",
}

export function InfoBadge({
  type = "info",
  icon,
  text,
  size = "md",
  dismissible = false,
  onDismiss,
  className,
}: InfoBadgeProps) {
  const [visible, setVisible] = React.useState(true)
  const config = typeConfig[type]
  const DefaultIcon = config.icon

  if (!visible) return null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      className={cn(
        "inline-flex items-start gap-3 rounded-lg border",
        config.bg,
        config.border,
        sizeConfig[size],
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icon || <DefaultIcon className={cn("h-5 w-5", config.text)} />}
      </div>
      <span className={cn("flex-1", config.text)}>{text}</span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn("flex-shrink-0 ml-2", config.text, "hover:opacity-70 transition-opacity")}
        >
          ✕
        </button>
      )}
    </div>
  )
}
