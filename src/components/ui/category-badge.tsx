"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  icon: LucideIcon
  label: string
  color?: "primary" | "accent" | "secondary" | "emerald" | "amber" | "orange"
  size?: "sm" | "md" | "lg"
  outlined?: boolean
  className?: string
}

const colorConfig = {
  primary: {
    bg: "bg-primary/10 dark:bg-primary/20",
    text: "text-primary dark:text-primary",
    border: "border-primary/30 dark:border-primary/40",
  },
  accent: {
    bg: "bg-accent/10 dark:bg-accent/20",
    text: "text-accent dark:text-accent",
    border: "border-accent/30 dark:border-accent/40",
  },
  secondary: {
    bg: "bg-secondary/10 dark:bg-secondary/20",
    text: "text-secondary dark:text-secondary",
    border: "border-secondary/30 dark:border-secondary/40",
  },
  emerald: {
    bg: "bg-accent/5 dark:bg-accent/20",
    text: "text-accent dark:text-emerald-400",
    border: "border-accent/20 dark:border-accent/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
}

const sizeConfig = {
  sm: { container: "px-2.5 py-1.5", icon: "h-3.5 w-3.5", text: "text-xs" },
  md: { container: "px-3 py-2", icon: "h-4 w-4", text: "text-sm" },
  lg: { container: "px-4 py-2.5", icon: "h-5 w-5", text: "text-base" },
}

export function CategoryBadge({
  icon: Icon,
  label,
  color = "primary",
  size = "md",
  outlined = false,
  className,
}: CategoryBadgeProps) {
  const colorStyles = colorConfig[color]
  const sizeStyles = sizeConfig[size]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full transition-all",
        sizeStyles.container,
        outlined
          ? `border-2 ${colorStyles.border} bg-transparent`
          : colorStyles.bg,
        colorStyles.text,
        "hover:shadow-md hover:scale-105 cursor-default",
        className
      )}
    >
      <Icon className={cn("flex-shrink-0", sizeStyles.icon)} />
      <span className={cn("font-semibold whitespace-nowrap", sizeStyles.text)}>
        {label}
      </span>
    </div>
  )
}
