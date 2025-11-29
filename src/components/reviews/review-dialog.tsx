"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    rating: z.number().min(1, "Debes seleccionar una calificación").max(5),
    comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres"),
})

interface ReviewDialogProps {
    matchId: string
    targetName: string
    trigger?: React.ReactNode
}

export function ReviewDialog({ matchId, targetName, trigger }: ReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log("Review submitted:", { matchId, ...values })
            toast.success("Reseña enviada exitosamente")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Error al enviar la reseña")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Calificar</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Calificar a {targetName}</DialogTitle>
                    <DialogDescription>
                        Comparte tu experiencia para ayudar a otros usuarios.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Calificación</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center gap-2 py-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => field.onChange(star)}
                                                >
                                                    <Star
                                                        className={cn(
                                                            "h-8 w-8 transition-colors",
                                                            // Safe rating comparison with default 0
                                                            (hoverRating || field.value || 0) >= star
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted-foreground"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comentario</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="¿Qué tal fue el servicio? ¿Lo recomendarías?"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar Reseña
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
