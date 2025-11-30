"use client"

import { Zap, Hammer, Wrench, Paintbrush } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
    { icon: Zap, text: "Electricidad: 12 solicitudes nuevas", color: "text-yellow-500" },
    { icon: Hammer, text: "Carpintería: 5 solicitudes nuevas", color: "text-orange-500" },
    { icon: Wrench, text: "Plomería: 8 solicitudes nuevas", color: "text-blue-500" },
    { icon: Paintbrush, text: "Pintura: 3 solicitudes nuevas", color: "text-pink-500" },
    { icon: Zap, text: "Electricidad: 12 solicitudes nuevas", color: "text-yellow-500" },
    { icon: Hammer, text: "Carpintería: 5 solicitudes nuevas", color: "text-orange-500" },
]

export function TickerLED() {
    return (
        <div className="w-full bg-black/90 text-white overflow-hidden py-2 border-b border-white/10 select-none pointer-events-none">
            <div className="flex whitespace-nowrap overflow-hidden relative">
                <div className="flex animate-marquee min-w-full shrink-0 items-center gap-8 px-4">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-mono tracking-wider">
                            <item.icon className={cn("h-4 w-4", item.color)} />
                            <span>{item.text}</span>
                            <span className="mx-4 text-white/20">|</span>
                        </div>
                    ))}
                </div>
                <div className="flex animate-marquee min-w-full shrink-0 items-center gap-8 px-4 absolute top-0 left-full">
                    {items.map((item, i) => (
                        <div key={`duplicate-${i}`} className="flex items-center gap-2 text-sm font-mono tracking-wider">
                            <item.icon className={cn("h-4 w-4", item.color)} />
                            <span>{item.text}</span>
                            <span className="mx-4 text-white/20">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
