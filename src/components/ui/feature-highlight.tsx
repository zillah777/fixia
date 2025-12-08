"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FeatureHighlightProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  badgeColor?: "emerald" | "amber" | "orange" | "teal"
  highlighted?: boolean
  className?: string
}

const badgeColorConfig = {
  emerald: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  amber: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  orange: "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  teal: "bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
}

export function FeatureHighlight({
  icon: Icon,
  title,
  description,
  badge,
  badgeColor = "emerald",
  highlighted = false,
  className,
}: FeatureHighlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "relative p-6 rounded-2xl border transition-all duration-300",
        highlighted
          ? "bg-gradient-to-br from-accent/5 to-primary/5 dark:from-accent/10 dark:to-primary/10 border-accent/50 shadow-lg shadow-accent/10"
          : "bg-white dark:bg-card border-border/50 hover:shadow-warm hover:border-border/80",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border",
            badgeColorConfig[badgeColor]
          )}
        >
          {badge}
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl flex-shrink-0",
          highlighted
            ? "bg-accent/20 dark:bg-accent/30"
            : "bg-primary/10 dark:bg-primary/20"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            highlighted
              ? "text-accent"
              : "text-primary"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
