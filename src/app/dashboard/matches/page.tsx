"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical, CheckCircle2, Lock, Star } from "lucide-react"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { cn } from "@/lib/utils"

// Mock data for matches
const matches = [
    {
        id: 1,
        user: {
            name: "Juan Pérez",
            image: "/placeholder-user.jpg",
            role: "Profesional",
            status: "online",
            phone: "+54 9 11 1234 5678"
        },
        service: "Instalación de Ventilador",
        lastMessage: "Perfecto, nos vemos mañana a las 14hs.",
        timestamp: "10:30 AM",
        unread: 2,
        status: "ACCEPTED" // PENDING, ACCEPTED, COMPLETED
    },
    {
        id: 2,
        user: {
            name: "Maria Gonzalez",
            image: "/placeholder-user-2.jpg",
            role: "Cliente",
            status: "offline",
            phone: null
        },
        service: "Reparación de Fuga",
        lastMessage: "¿Podrías pasarme un presupuesto?",
        timestamp: "Ayer",
        unread: 0,
        status: "PENDING"
    },
]

// Mock messages for chat
const initialMessages = [
    { id: 1, senderId: "other", text: "Hola! Vi tu solicitud para instalar el ventilador.", timestamp: "10:00 AM" },
    { id: 2, senderId: "me", text: "Hola Juan, sí. ¿Tenés disponibilidad para mañana?", timestamp: "10:05 AM" },
    { id: 3, senderId: "other", text: "Sí, tengo un hueco a las 14hs. El precio es el acordado en la propuesta.", timestamp: "10:15 AM" },
    { id: 4, senderId: "me", text: "Dale, me sirve. Confirmamos entonces.", timestamp: "10:20 AM" },
    { id: 5, senderId: "other", text: "Perfecto, nos vemos mañana a las 14hs.", timestamp: "10:30 AM" },
]

export default function MatchesPage() {
    const [selectedMatch, setSelectedMatch] = useState(matches[0])
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState("")

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const msg = {
            id: messages.length + 1,
            senderId: "me",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages([...messages, msg])
        setNewMessage("")
    }

    const handleWhatsAppClick = () => {
        if (selectedMatch.status !== "ACCEPTED") return
        window.open(`https://wa.me/${selectedMatch.user.phone?.replace(/[^0-9]/g, '')}`, '_blank')
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4">
            {/* Matches List */}
            <Card className="w-full md:w-1/3 flex flex-col">
                <CardHeader className="border-b px-4 py-3">
                    <CardTitle className="text-lg">Mensajes</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {matches.map((match) => (
                            <button
                                key={match.id}
                                onClick={() => setSelectedMatch(match)}
                                className={cn(
                                    "flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                                    selectedMatch.id === match.id && "bg-accent"
                                )}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={match.user.image} />
                                        <AvatarFallback>{match.user.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    {match.user.status === "online" && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">{match.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{match.timestamp}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate font-medium text-primary">
                                        {match.service}
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm text-muted-foreground truncate max-w-[140px]">
                                            {match.lastMessage}
                                        </span>
                                        {match.unread > 0 && (
                                            <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                                {match.unread}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={selectedMatch.user.image} />
                            <AvatarFallback>{selectedMatch.user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{selectedMatch.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {selectedMatch.user.role} • {selectedMatch.user.status === "online" ? "En línea" : "Desconectado"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedMatch.status === "ACCEPTED" ? (
                            <Button variant="outline" size="icon" onClick={handleWhatsAppClick} title="Contactar por WhatsApp">
                                <Phone className="h-4 w-4 text-green-600" />
                            </Button>
                        ) : (
                            <Button variant="ghost" size="icon" disabled title="Contacto bloqueado hasta confirmar match">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        {selectedMatch.status === "ACCEPTED" && (
                            <ReviewDialog
                                matchId={selectedMatch.id.toString()}
                                targetName={selectedMatch.user.name}
                                trigger={
                                    <Button variant="ghost" size="icon" title="Calificar Usuario">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {/* System Message for Status */}
                        <div className="flex justify-center">
                            <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full flex items-center gap-2">
                                {selectedMatch.status === "ACCEPTED" ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" />
                                        Match confirmado. Datos de contacto revelados.
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-3 w-3" />
                                        Acepta la propuesta para ver los datos de contacto.
                                    </>
                                )}
                            </div>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                                    msg.senderId === "me"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.text}
                                <span className={cn(
                                    "text-[10px]",
                                    msg.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                                )}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Enviar</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
