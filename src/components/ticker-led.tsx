"use client"

import { useState, useEffect } from "react"
import { Zap, Hammer, Wrench, Paintbrush, Flame, Truck, Sparkles, Leaf, Briefcase } from "lucide-react"
import Marquee from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, any> = {
    "Zap": Zap,
    "Hammer": Hammer,
    "Wrench": Wrench,
    "Paintbrush": Paintbrush,
    "Flame": Flame,
    "Truck": Truck,
    "Sparkles": Sparkles,
    "Leaf": Leaf,
    "Briefcase": Briefcase
}

export function TickerLED() {
    const [items, setItems] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/public/ticker")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setItems(data)
                } else {
                    // Fallback if no data (optional, or just show nothing)
                    setItems([])
                }
            })
            .catch(err => console.error("Failed to fetch ticker data", err))
    }, [])

    if (items.length === 0) return null

    return (
        <div className="relative w-full bg-background/50 border-b border-border/40 overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <Marquee className="py-3 [--duration:40s] [--gap:3rem]" pauseOnHover>
                {items.map((item, i) => {
                    const Icon = ICON_MAP[item.iconName] || Briefcase
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-3 group cursor-default transition-all duration-300 hover:scale-105"
                        >
                            <div className={cn(
                                "p-2 rounded-full bg-background border border-border/50 shadow-sm transition-colors group-hover:bg-muted/50",
                                // Adjusting dynamic colors for light theme - using text/bg variants
                                // logic: stick to the text color for the icon, maybe adding a light bg tint
                            )}>
                                <Icon className={cn("h-4 w-4", item.color)} />
                            </div>
                            <span className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                                {item.text}
                            </span>
                            <div className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-2" />
                        </div>
                    )
                })}
            </Marquee>

            {/* Gradient masks for smooth fade edges - updated to match light background */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
    )
}
