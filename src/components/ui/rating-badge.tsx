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

const GOLD_COLOR = "#d4a574"
const DARK_TEXT = "#2d3d24"
const LIGHT_GRAY = "#e8e8e8"

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
            className={sizeConfig[size].star}
            style={{
              fill: GOLD_COLOR,
              color: GOLD_COLOR
            }}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star
              className={sizeConfig[size].star}
              style={{ color: LIGHT_GRAY }}
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={sizeConfig[size].star}
                style={{
                  fill: GOLD_COLOR,
                  color: GOLD_COLOR
                }}
              />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={sizeConfig[size].star}
            style={{
              color: variant === "filled" ? LIGHT_GRAY : "#e0e0e0"
            }}
          />
        ))}
      </div>

      <div
        className={cn("font-semibold", sizeConfig[size].text)}
        style={{ color: DARK_TEXT }}
      >
        {rating.toFixed(1)}
      </div>

      {showCount && (
        <span
          className={cn("", sizeConfig[size].text)}
          style={{ color: "#888888" }}
        >
          ({count})
        </span>
      )}
    </div>
  )
}
