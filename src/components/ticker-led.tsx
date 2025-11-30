"use client"

import { Zap, Hammer, Wrench, Paintbrush, Flame, Truck } from "lucide-react"
import Marquee from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

const items = [
    { icon: Zap, text: "Electricidad: 12 solicitudes nuevas", color: "text-yellow-400" },
    { icon: Hammer, text: "Carpintería: 5 solicitudes nuevas", color: "text-orange-400" },
    { icon: Wrench, text: "Plomería: 8 solicitudes nuevas", color: "text-blue-400" },
    { icon: Paintbrush, text: "Pintura: 3 solicitudes nuevas", color: "text-pink-400" },
    { icon: Flame, text: "Gasista: 4 solicitudes nuevas", color: "text-red-400" },
    { icon: Truck, text: "Fletes: 6 solicitudes nuevas", color: "text-green-400" },
]

export function TickerLED() {
    return (
        <div className="relative w-full bg-slate-950 border-b border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

            <Marquee className="py-2.5 [--duration:30s] [--gap:3rem]" pauseOnHover>
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-2 group cursor-default transition-all duration-300 hover:scale-105"
                    >
                        <div className={cn(
                            "p-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors group-hover:bg-white/10",
                            item.color.replace("text-", "shadow-").replace("-400", "-500/20")
                        )}>
                            <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                        </div>
                        <span className="text-sm font-medium tracking-wide text-slate-300 group-hover:text-white transition-colors">
                            {item.text}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-700 mx-2" />
                    </div>
                ))}
            </Marquee>

            {/* Gradient masks for smooth fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10" />
        </div>
    )
}
