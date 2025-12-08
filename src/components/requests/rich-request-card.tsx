"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, DollarSign, ChevronRight, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface RequestData {
    id: string
    title: string
    description: string
    category: string
    status: "OPEN" | "IN_PROGRESS" | "COMPLETED"
    budget: {
        min: number
        max: number
        currency: string
    }
    location: string
    date: string
    urgency?: "LOW" | "MEDIUM" | "HIGH"
    proposalsCount: number
    imageUrl?: string
}

interface RichRequestCardProps {
    data: RequestData
    onClick?: () => void
}

const urgencyColors = {
    LOW: "bg-secondary/10 text-secondary border-secondary/20",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    HIGH: "bg-destructive/10 text-destructive border-destructive/20 animate-pulse",
}

const statusColors = {
    OPEN: "bg-accent",
    IN_PROGRESS: "bg-secondary",
    COMPLETED: "bg-gray-500",
}

export function RichRequestCard({ data, onClick }: RichRequestCardProps) {
    const formatBudget = (min: number, max: number) => {
        if (!min || (min === 0 && max === 0)) return "A convenir"
        if (min === max) return `$${min.toLocaleString()}`
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Card
                className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer relative"
                onClick={onClick}
            >
                {/* Status Indicator Line */}
                <div className={cn("absolute top-0 left-0 w-1.5 h-full transition-colors", statusColors[data.status])} />

                <CardContent className="p-5 pl-7">
                    <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                            <Badge variant="outline" className="rounded-full text-xs font-normal bg-gray-50/50 backdrop-blur-sm border-gray-200">
                                {data.category}
                            </Badge>
                            <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                {data.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {data.description}
                            </p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                            <div className="flex flex-col items-end">
                                <span className={cn(
                                    "font-bold text-accent tracking-tight whitespace-nowrap",
                                    data.budget.min === 0 ? "text-sm text-muted-foreground" : "text-lg"
                                )}>
                                    {formatBudget(data.budget.min, data.budget.max)}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                    Presupuesto
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-5">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate">{data.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate">{data.date}</span>
                        </div>
                        {data.urgency && (
                            <div className="flex items-center gap-2 col-span-2">
                                <Badge className={cn("text-[10px] px-2 py-0.5 border h-5", urgencyColors[data.urgency])}>
                                    {data.urgency === 'HIGH' && <Clock className="h-3 w-3 mr-1" />}
                                    Urgencia {data.urgency === 'HIGH' ? 'Alta' : data.urgency === 'MEDIUM' ? 'Media' : 'Baja'}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-gray-50 px-2 py-1 rounded-md">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{data.proposalsCount} Propuestas</span>
                        </div>

                        <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-primary/5 hover:text-primary rounded-full group-hover:pr-2 transition-all">
                            Ver Detalles
                            <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
