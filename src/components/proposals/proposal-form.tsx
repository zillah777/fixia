"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Send } from "lucide-react"
import { toast } from "sonner"

interface ProposalFormProps {
    requestId: string
    onSuccess?: () => void
}

export function ProposalForm({ requestId, onSuccess }: ProposalFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!price || !message) {
            toast.error("Por favor completa todos los campos")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/proposals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    price: Number(price),
                    message
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Error al enviar la propuesta")
            }

            toast.success("¡Propuesta enviada con éxito!", {
                description: "El cliente revisará tu oferta pronto."
            })

            setPrice("")
            setMessage("")
            onSuccess?.()
            router.refresh()

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Send className="h-5 w-5" />
                    Enviar Propuesta
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-left">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Tu Presupuesto (ARS)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                className="pl-9 text-lg font-medium"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                step="100"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ingresa el monto total estimado por tu trabajo.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Mensaje / Carta de Presentación</Label>
                        <Textarea
                            id="message"
                            placeholder="Hola, me interesa tu proyecto. Tengo experiencia en..."
                            className="min-h-[120px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Explica por qué eres el indicado para este trabajo.
                        </p>
                    </div>

                    <Button type="submit" className="w-full text-base py-6" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar Presupuesto"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
