"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, DollarSign, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface MarketplaceRequestData {
    id: string
    title: string
    category: string
    budget: {
        min: number
        max: number
    }
    location: string
    date: string
    urgency: "LOW" | "MEDIUM" | "HIGH"
    proposalsCount: number
    distance: string
}

interface MarketplaceRequestCardProps {
    data: MarketplaceRequestData
    onApply: () => void
}

export function MarketplaceRequestCard({ data, onApply }: MarketplaceRequestCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group"
        >
            <Card className="overflow-hidden border border-[#6a9bcc]/20 hover:border-[#6a9bcc]/40 shadow-md hover:shadow-xl hover:shadow-[#6a9bcc]/10 transition-all duration-300 bg-white dark:bg-card">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="rounded-full text-[10px] font-normal" style={{ backgroundColor: "#6a9bcc/10", borderColor: "#6a9bcc/30", color: "#6a9bcc" }}>
                                    {data.category}
                                </Badge>
                                {data.urgency === 'HIGH' && (
                                    <Badge className="rounded-full text-[10px] bg-red-500/10 text-red-600 border-none px-2">
                                        Urgente
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-lg font-bold leading-tight transition-colors line-clamp-2" style={{ color: "var(--foreground)" }}>
                                {data.title}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" style={{ color: "#d97757" }} />
                            <span className="truncate">{data.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "#788c5d/10", color: "#788c5d" }}>
                                {data.distance}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="h-3.5 w-3.5" style={{ color: "#6a9bcc" }} />
                            <span className="truncate">{data.date}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#e8e6dc]/50 dark:border-border/50">
                        <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Presupuesto</p>
                            <p className="font-bold" style={{ color: "#d97757" }}>
                                ${data.budget.min.toLocaleString()} - ${data.budget.max.toLocaleString()}
                            </p>
                        </div>
                        <Button size="sm" onClick={onApply} className="rounded-full text-white shadow-lg transition-all hover:scale-105" style={{ backgroundImage: "linear-gradient(to right, #d97757, rgba(217, 119, 87, 0.9))", boxShadow: "0 4px 12px rgba(217, 119, 87, 0.2)" }}>
                            Enviar Oferta
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
