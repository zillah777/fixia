import Image from "next/image"
import { Star, Heart, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
}: ServiceCardProps) {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary/90 backdrop-blur-sm">
                    {category}
                </Badge>
            </div>

            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border">
                            <AvatarImage src={providerAvatar} />
                            <AvatarFallback>{providerName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[100px]">
                            {providerName}
                        </span>
                    </div>
                    <StarRating rating={rating} reviewsCount={reviewsCount} />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-muted/20 mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Desde</span>
                    <span className="font-bold text-lg text-primary">
                        ${price.toLocaleString()}
                    </span>
                </div>
                <Button size="sm" className="font-medium">
                    Ver Detalle
                </Button>
            </CardFooter>
        </Card>
    )
}
