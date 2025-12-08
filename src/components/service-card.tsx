import Image from "next/image"
import { Star, Heart, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TrustBadge } from "@/components/ui/trust-badges"
import { RatingBadge } from "@/components/ui/rating-badge"

interface ServiceCardProps {
    title: string
    providerName: string
    providerAvatar?: string
    rating: number
    reviewsCount: number
    price: number
    image: string
    category: string
    location: string
    isVerified?: boolean
    isFast?: boolean
    isPremium?: boolean
}

function StarRating({ rating, reviewsCount }: { rating: number; reviewsCount: number }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="cursor-help">
                    <div className="flex items-center gap-1 bg-amber-500/15 px-2 py-1.5 rounded-lg hover:bg-amber-500/25 transition-colors">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 transition-colors ${
                                        i < Math.floor(rating)
                                            ? 'fill-amber-500 text-amber-500'
                                            : i < Math.ceil(rating)
                                            ? 'fill-amber-500/50 text-amber-500'
                                            : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent className="text-xs">
                {reviewsCount} reseñas verificadas
            </TooltipContent>
        </Tooltip>
    )
}

export function ServiceCard({
    title,
    providerName,
    providerAvatar,
    rating,
    reviewsCount,
    price,
    image,
    category,
    location,
    isVerified = true,
    isFast = false,
    isPremium = false,
}: ServiceCardProps) {
    return (
        <Card className="overflow-hidden group hover:shadow-warm transition-all duration-300 border-border/50 flex flex-col h-full bg-white dark:bg-card">
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm hover:bg-white dark:hover:bg-card text-muted-foreground hover:text-accent transition-all shadow-md hover:shadow-lg"
                >
                    <Heart className="h-4 w-4" />
                </Button>

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-accent/90 hover:bg-accent text-accent-foreground backdrop-blur-sm shadow-md text-xs sm:text-sm">
                    {category}
                </Badge>
            </div>

            {/* Content */}
            <CardHeader className="p-4 pb-2 space-y-2 flex-1">
                <h3 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                </div>
            </CardHeader>

            {/* Provider Info */}
            <CardContent className="p-4 pt-0 space-y-3">
                {/* Provider Name + Badges */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-7 w-7 border border-border/50 flex-shrink-0">
                            <AvatarImage src={providerAvatar} />
                            <AvatarFallback className="text-xs">{providerName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                            {providerName}
                        </span>
                    </div>
                    {isVerified && (
                        <TrustBadge variant="verified" size="sm" />
                    )}
                </div>

                {/* Trust + Fast Badges Row */}
                {isFast && (
                    <div className="flex gap-1.5">
                        <TrustBadge variant="fast" size="sm" />
                    </div>
                )}

                {/* Rating + Reviews */}
                <RatingBadge rating={rating} count={reviewsCount} showCount size="sm" />
            </CardContent>

            {/* Footer with Price & CTA */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/30 bg-gradient-to-r from-transparent via-muted/10 to-transparent mt-auto gap-2">
                <div className="flex flex-col min-w-0">
                    <span className="text-xs text-muted-foreground">Desde</span>
                    <span className="font-bold text-sm sm:text-base text-accent">
                        ${price.toLocaleString()}
                    </span>
                </div>
                <Button
                    size="sm"
                    className="font-semibold text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 transition-all flex-shrink-0"
                >
                    Ver
                </Button>
            </CardFooter>
        </Card>
    )
}
