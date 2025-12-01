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
            <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="rounded-full text-[10px] font-normal bg-gray-50 border-gray-200">
                                    {data.category}
                                </Badge>
                                {data.urgency === 'HIGH' && (
                                    <Badge className="rounded-full text-[10px] bg-red-100 text-red-700 border-none px-2">
                                        Urgente
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-lg font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                {data.title}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate">{data.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                {data.distance}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate">{data.date}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Presupuesto</p>
                            <p className="font-bold text-gray-900">
                                ${data.budget.min.toLocaleString()} - ${data.budget.max.toLocaleString()}
                            </p>
                        </div>
                        <Button size="sm" onClick={onApply} className="rounded-full bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/20">
                            Enviar Oferta
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
