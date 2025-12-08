"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ShieldCheck, Award, MessageCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ProposalData {
    id: string
    proName: string
    proAvatar: string
    rating: number
    reviewsCount: number
    price: number
    message: string
    isVerified: boolean
    isElite: boolean
    badges: ("TOP_RATED" | "CERTIFIED" | "QUICK_RESPONDER")[]
}

interface ProProposalCardProps {
    data: ProposalData
    onAccept: () => void
    onViewProfile: () => void
}

export function ProProposalCard({ data, onAccept, onViewProfile }: ProProposalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="w-full"
        >
            <Card className={cn(
                "overflow-hidden border-none transition-all duration-300 relative",
                data.isElite
                    ? "shadow-xl shadow-yellow-500/10 border-2 border-yellow-400/30 bg-gradient-to-b from-white to-yellow-50/30"
                    : "shadow-md hover:shadow-lg bg-white"
            )}>
                {/* Elite Glow Effect */}
                {data.isElite && (
                    <div className="absolute top-0 right-0 p-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-sm">
                            <Award className="h-3 w-3 mr-1" /> ELITE PRO
                        </Badge>
                    </div>
                )}

                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="relative shrink-0">
                            <Avatar className={cn("h-16 w-16 border-2", data.isElite ? "border-yellow-400 ring-2 ring-yellow-100" : "border-gray-100")}>
                                <AvatarImage src={data.proAvatar} />
                                <AvatarFallback>{data.proName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {data.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-secondary text-white rounded-full p-0.5 border-2 border-white" title="Identidad Verificada">
                                    <ShieldCheck className="h-3 w-3" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg truncate">{data.proName}</h3>
                                {data.isVerified && <CheckCircle2 className="h-4 w-4 text-secondary" />}
                            </div>

                            <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-bold">{data.rating}</span>
                                <span className="text-muted-foreground">({data.reviewsCount} reseñas)</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {data.badges.includes("TOP_RATED") && (
                                    <Badge variant="secondary" className="text-[10px] bg-accent/10 text-accent border-accent/20">
                                        Top Rated
                                    </Badge>
                                )}
                                {data.badges.includes("CERTIFIED") && (
                                    <Badge variant="secondary" className="text-[10px] bg-secondary/10 text-secondary border-secondary/20">
                                        Certificado
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-gray-900">
                                ${data.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Presupuesto</div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 italic relative">
                        <MessageCircle className="h-4 w-4 absolute -top-2 -left-2 text-gray-300 bg-white rounded-full" />
                        &quot;{data.message}&quot;
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={onViewProfile}>
                        Ver Perfil
                    </Button>
                    <Button
                        className={cn(
                            "flex-1 rounded-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95",
                            data.isElite
                                ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-orange-500/20"
                                : "bg-black hover:bg-gray-800 shadow-black/20"
                        )}
                        onClick={onAccept}
                    >
                        Aceptar Propuesta
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
