"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingBadge } from "@/components/ui/rating-badge"
import { cn } from "@/lib/utils"

interface Review {
    id: string
    score: number
    comment?: string
    createdAt: Date
    author: {
        id: string
        name: string
        avatar?: string | null
    }
}

interface RatingSummaryProps {
    rating: number
    reviewCount: number
    recentReviews?: Review[]
    size?: "sm" | "md" | "lg"
    showRecentReviews?: boolean
    className?: string
}

export function RatingSummary({
    rating,
    reviewCount,
    recentReviews = [],
    size = "md",
    showRecentReviews = true,
    className
}: RatingSummaryProps) {
    const sizeClasses = {
        sm: "p-3",
        md: "p-4",
        lg: "p-6"
    }

    const titleSizes = {
        sm: "text-2xl",
        md: "text-3xl",
        lg: "text-4xl"
    }

    return (
        <Card className={cn("border border-border/50", className)}>
            <CardHeader className={sizeClasses[size]}>
                <CardTitle className="text-lg">Calificación</CardTitle>
            </CardHeader>
            <CardContent className={cn("space-y-4", sizeClasses[size], "-mt-2")}>
                {/* Rating Summary */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className={cn("font-bold text-foreground", titleSizes[size])}>
                            {rating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "h-3 w-3 sm:h-4 sm:w-4",
                                            star <= Math.round(rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                                {reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recent Reviews Preview */}
                {showRecentReviews && recentReviews.length > 0 && (
                    <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-sm">Reseñas recientes</h4>
                        {recentReviews.slice(0, 2).map((review) => (
                            <div key={review.id} className="text-sm space-y-1 pb-3 border-b last:border-0 last:pb-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-xs sm:text-sm">{review.author.name}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "h-2.5 w-2.5 sm:h-3 sm:w-3",
                                                    star <= review.score
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-200 dark:text-gray-700"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                        &quot;{review.comment}&quot;
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
