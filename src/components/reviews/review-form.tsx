"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
    isOpen: boolean
    onClose: () => void
    proName: string
    onSubmit: (rating: number, comment: string) => void
}

export function ReviewForm({ isOpen, onClose, proName, onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        onSubmit(rating, comment)
        toast.success("¡Gracias por tu calificación!")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Calificar Trabajo</DialogTitle>
                    <DialogDescription className="text-center">
                        ¿Cómo fue tu experiencia con <span className="font-bold text-foreground">{proName}</span>?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={cn(
                                        "h-10 w-10 transition-colors duration-200",
                                        (hoverRating || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-100 text-gray-200"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="text-center text-sm font-medium text-muted-foreground h-4">
                        {rating === 1 && "Malo"}
                        {rating === 2 && "Regular"}
                        {rating === 3 && "Bueno"}
                        {rating === 4 && "Muy Bueno"}
                        {rating === 5 && "¡Excelente!"}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comentario (Opcional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Cuéntanos más detalles..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Omitir</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || rating === 0}
                        className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                    >
                        {isLoading ? "Enviando..." : "Enviar Calificación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
