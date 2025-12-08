"use client"

import React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  maxRating?: number
  showCount?: boolean
  count?: number
  size?: "sm" | "md" | "lg"
  variant?: "filled" | "outlined"
  className?: string
}

const sizeConfig = {
  sm: { star: "h-3.5 w-3.5", text: "text-xs" },
  md: { star: "h-4 w-4", text: "text-sm" },
  lg: { star: "h-5 w-5", text: "text-base" },
}

export function RatingBadge({
  rating,
  maxRating = 5,
  showCount = false,
  count = 0,
  size = "md",
  variant = "filled",
  className,
}: RatingBadgeProps) {
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {/* Filled Stars */}
        {[...Array(filledStars)].map((_, i) => (
          <Star
            key={`filled-${i}`}
            className={cn(
              sizeConfig[size].star,
              "fill-amber-400 text-amber-400"
            )}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeConfig[size].star, "text-gray-300")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={cn(
                  sizeConfig[size].star,
                  "fill-amber-400 text-amber-400"
                )}
              />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(
              sizeConfig[size].star,
              variant === "filled"
                ? "text-gray-300"
                : "text-gray-200 dark:text-gray-700"
            )}
          />
        ))}
      </div>

      <div className={cn("font-semibold text-amber-700 dark:text-amber-400", sizeConfig[size].text)}>
        {rating.toFixed(1)}
      </div>

      {showCount && (
        <span className={cn("text-muted-foreground", sizeConfig[size].text)}>
          ({count})
        </span>
      )}
    </div>
  )
}
