"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TeaserCardProps {
    data: {
        title: string
        category: string
        date: string
    }
}

export function TeaserCard({ data }: TeaserCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm relative group">
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3 filter blur-[2px] select-none">
                    <div className="space-y-1">
                        <Badge variant="outline" className="rounded-full text-xs font-normal">
                            {data.category}
                        </Badge>
                        <h3 className="text-lg font-bold leading-tight line-clamp-2">
                            {data.title}
                        </h3>
                    </div>
                </div>

                {/* Metadata Grid (Blurred) */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-5 filter blur-[3px] select-none">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Ubicación Oculta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{data.date}</span>
                    </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 p-4 text-center z-10">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-[280px]">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Solo Profesionales</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                            Regístrate como profesional para ver detalles y postularte.
                        </p>
                        <Link href="/dashboard/subscription">
                            <Button size="sm" className="w-full rounded-full bg-black text-white hover:bg-neutral-800">
                                Ser Profesional
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
