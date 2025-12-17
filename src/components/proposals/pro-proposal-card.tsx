"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, ShieldCheck, Award, MessageCircle, CheckCircle2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    onAccept?: () => void
    onViewProfile: () => void
    onDelete?: (id: string) => void
    isOwnProposal?: boolean
}

export function ProProposalCard({ data, onAccept, onViewProfile, onDelete, isOwnProposal }: ProProposalCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/proposals/${data.id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Propuesta eliminada correctamente")
                onDelete?.(data.id)
            } else {
                const error = await res.json()
                toast.error(error.error || "Error al eliminar la propuesta")
            }
        } catch (error) {
            console.error("Error deleting proposal:", error)
            toast.error("Error al eliminar la propuesta")
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="w-full"
        >
            <Card className={cn(
                "overflow-hidden transition-all duration-300 relative",
                data.isElite
                    ? "shadow-xl border-2 border-[#d97757]/40 bg-gradient-to-b from-white to-[#d97757]/5 hover:shadow-[#d97757]/30"
                    : "shadow-md hover:shadow-lg bg-white border border-[#6a9bcc]/20 hover:border-[#6a9bcc]/40"
            )}>
                {/* Elite Glow Effect */}
                {data.isElite && (
                    <div className="absolute top-0 right-0 p-2">
                        <Badge className="bg-gradient-to-r from-[#d97757] to-[#d97757]/90 text-white border-none shadow-sm">
                            <Award className="h-3 w-3 mr-1" /> ELITE PRO
                        </Badge>
                    </div>
                )}

                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="relative shrink-0">
                            <Avatar className={cn("h-16 w-16 border-2", data.isElite ? "border-[#d97757] ring-2 ring-[#d97757]/10" : "border-[#6a9bcc]")}>
                                <AvatarImage src={data.proAvatar} />
                                <AvatarFallback>{data.proName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {data.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-[#6a9bcc] text-white rounded-full p-0.5 border-2 border-white" title="Identidad Verificada">
                                    <ShieldCheck className="h-3 w-3" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg truncate">{data.proName}</h3>
                                {data.isVerified && <CheckCircle2 className="h-4 w-4" style={{ color: "#6a9bcc" }} />}
                            </div>

                            <div className="flex items-center gap-1 text-sm mb-2" style={{ color: "#d97757" }}>
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-bold">{data.rating}</span>
                                <span className="text-muted-foreground">({data.reviewsCount} reseñas)</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {data.badges.includes("TOP_RATED") && (
                                    <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: "#d97757/10", color: "#d97757", borderColor: "#d97757/20" }}>
                                        Top Rated
                                    </Badge>
                                )}
                                {data.badges.includes("CERTIFIED") && (
                                    <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: "#6a9bcc/10", color: "#6a9bcc", borderColor: "#6a9bcc/20" }}>
                                        Certificado
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div className="text-2xl font-bold" style={{ color: "#d97757" }}>
                                ${data.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Presupuesto</div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-[#e8e6dc]/30 dark:bg-muted/30 rounded-xl text-sm text-muted-foreground italic relative border border-[#6a9bcc]/20">
                        <MessageCircle className="h-4 w-4 absolute -top-2 -left-2" style={{ color: "#6a9bcc" }} style={{ backgroundColor: "white", borderRadius: "9999px" }} />
                        &quot;{data.message}&quot;
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-3">
                    {isOwnProposal ? (
                        <>
                            <Button variant="outline" className="flex-1 rounded-xl border-[#6a9bcc] text-[#6a9bcc] hover:bg-[#6a9bcc]/10" onClick={onViewProfile}>
                                Ver Solicitud
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" className="flex-1 rounded-xl border-[#6a9bcc] text-[#6a9bcc] hover:bg-[#6a9bcc]/10" onClick={onViewProfile}>
                                Ver Perfil
                            </Button>
                            <Button
                                className={cn(
                                    "flex-1 rounded-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95",
                                    data.isElite
                                        ? "bg-gradient-to-r from-[#d97757] to-[#d97757]/90 hover:from-[#d97757]/90 hover:to-[#d97757] shadow-[#d97757]/20"
                                        : "bg-gradient-to-r from-[#6a9bcc] to-[#6a9bcc]/90 hover:from-[#6a9bcc]/90 hover:to-[#6a9bcc] shadow-[#6a9bcc]/20"
                                )}
                                onClick={onAccept}
                            >
                                Aceptar Propuesta
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </motion.div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar propuesta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará tu propuesta de ${data.price.toLocaleString()}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
