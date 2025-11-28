"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ReviewFormProps {
    matchId: string
    authorId: string
    targetId: string
    onSuccess?: () => void
}

export function ReviewForm({ matchId, authorId, targetId, onSuccess }: ReviewFormProps) {
    const [score, setScore] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hoveredScore, setHoveredScore] = useState(0)

    const handleSubmit = async () => {
        if (score === 0) {
            toast.error("Por favor selecciona una calificación")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId,
                    authorId,
                    targetId,
                    score,
                    comment
                }),
            })

            if (!response.ok) throw new Error("Error al enviar reseña")

            toast.success("¡Gracias por tu opinión!")
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error("No se pudo enviar la reseña")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h3 className="font-semibold text-lg">Calificar Servicio</h3>

            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoveredScore(star)}
                        onMouseLeave={() => setHoveredScore(0)}
                        onClick={() => setScore(star)}
                    >
                        <Star
                            className={`h-8 w-8 ${star <= (hoveredScore || score)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <Textarea
                placeholder="Cuéntanos tu experiencia..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
            />

            <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? "Enviando..." : "Enviar Calificación"}
            </Button>
        </div>
    )
}
