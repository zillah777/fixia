"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface ProposalDialogProps {
    isOpen: boolean
    onClose: () => void
    requestTitle: string
}

const TEMPLATES = [
    { id: 1, label: "Disponible Hoy", text: "Hola! Tengo disponibilidad para realizar este trabajo hoy mismo. Cuento con las herramientas y experiencia necesaria." },
    { id: 2, label: "Presupuesto Estimado", text: "Hola! Por lo que describes, el trabajo costaría aproximadamente el monto indicado. Incluye materiales y mano de obra." },
    { id: 3, label: "Visita Técnica", text: "Hola! Me gustaría coordinar una visita técnica para evaluar mejor el problema y darte un presupuesto exacto." }
]

export function ProposalDialog({ isOpen, onClose, requestTitle }: ProposalDialogProps) {
    const [message, setMessage] = useState("")
    const [price, setPrice] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleTemplateClick = (text: string) => {
        setMessage(text)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        toast.success("¡Propuesta enviada con éxito!")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enviar Propuesta</DialogTitle>
                    <DialogDescription>
                        Para: <span className="font-medium text-foreground">{requestTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Tu Presupuesto ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="Ej: 25000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="text-lg font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="message">Mensaje</Label>
                            <span className="text-xs text-muted-foreground">Respuestas rápidas:</span>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {TEMPLATES.map((t) => (
                                <Badge
                                    key={t.id}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-secondary/10 hover:text-secondary whitespace-nowrap transition-colors"
                                    onClick={() => handleTemplateClick(t.text)}
                                >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {t.label}
                                </Badge>
                            ))}
                        </div>

                        <Textarea
                            id="message"
                            placeholder="Escribe tu propuesta aquí..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !price || !message} className="bg-black text-white hover:bg-gray-800">
                        {isLoading ? "Enviando..." : "Enviar Propuesta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
