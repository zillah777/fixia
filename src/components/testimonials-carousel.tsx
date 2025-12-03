"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface Testimonial {
    id: string
    name: string
    role: string
    text: string
    avatar: string
    rating: number
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "center" },
        [Autoplay({ delay: 5000, stopOnInteraction: true })]
    )

    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
        return () => {
            emblaApi.off("select", onSelect)
            emblaApi.off("reInit", onSelect)
        }
    }, [emblaApi, onSelect])

    const scrollPrev = () => emblaApi?.scrollPrev()
    const scrollNext = () => emblaApi?.scrollNext()

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex gap-4 -ml-4">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                        >
                            <div className="h-full p-6 md:p-8 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:shadow-lg transition-all duration-300 hover:border-border flex flex-col">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(testimonial.rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-base md:text-lg text-foreground mb-6 flex-1 leading-relaxed">
                                    &quot;{testimonial.text}&quot;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={testimonial.avatar} />
                                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 justify-center mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className="rounded-full"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className="rounded-full"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
