"use client"

import { motion } from "framer-motion"
import { Zap, Hammer, Wrench, Paintbrush } from "lucide-react"

const items = [
    { icon: Zap, text: "Electricidad: 12 solicitudes nuevas", color: "text-yellow-500" },
    { icon: Hammer, text: "Carpintería: 5 solicitudes nuevas", color: "text-orange-500" },
    { icon: Wrench, text: "Plomería: 8 solicitudes nuevas", color: "text-blue-500" },
    { icon: Paintbrush, text: "Pintura: 3 solicitudes nuevas", color: "text-pink-500" },
    { icon: Zap, text: "Electricidad: 12 solicitudes nuevas", color: "text-yellow-500" }, // Duplicate for loop
    { icon: Hammer, text: "Carpintería: 5 solicitudes nuevas", color: "text-orange-500" },
]

export function TickerLED() {
    return (
        <div className="w-full bg-black/90 text-white overflow-hidden py-2 border-b border-white/10">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                >
                    {[...items, ...items, ...items].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-mono tracking-wider">
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                            <span>{item.text}</span>
                            <span className="mx-4 text-white/20">|</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
