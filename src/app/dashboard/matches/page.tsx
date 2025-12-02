"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, CheckCircle2, Star, Loader2 } from "lucide-react"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Match, Message, User } from "@/types/match"

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([])
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMatches()
    }, [])

    const fetchMatches = async () => {
        try {
            const res = await fetch("/api/matches")
            if (res.ok) {
                const data: Match[] = await res.json()
                setMatches(data)
                if (data.length > 0) {
                    handleSelectMatch(data[0])
                }
            }
        } catch (error) {
            console.error("Failed to fetch matches", error)
            toast.error("Error al cargar conversaciones")
        } finally {
            setLoading(false)
        }
    }

    const handleSelectMatch = (match: Match) => {
        setSelectedMatch(match)
        // In a real app, we would fetch messages from /api/messages?matchId=...
        // For now, we simulate the proposal message as the first message
        const proposalMsg = match.request.proposals?.[0]?.message || "Hola, estoy interesado en tu solicitud."

        setMessages([
            {
                id: 1,
                senderId: "other",
                text: proposalMsg,
                timestamp: new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ])
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const tempMsg: Message = {
            id: Date.now(),
            senderId: "me",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages((prev) => [...prev, tempMsg])
        setNewMessage("")

        try {
            // Placeholder for API call
            // await fetch('/api/messages', { method: 'POST', body: JSON.stringify({ text: newMessage, matchId: selectedMatch?.id }) })
        } catch (error) {
            toast.error("Error al enviar mensaje")
            // Optionally revert optimistic update here
        }
    }

    const handleWhatsAppClick = () => {
        if (!selectedMatch) return
        const phone = selectedMatch.provider?.phone || selectedMatch.client?.phone
        if (phone) {
            window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank')
        } else {
            toast.error("Número de teléfono no disponible")
        }
    }

    const getOtherUser = (match: Match): User => {
        // Fallback to a default user object if neither exists, though ideally one should
        return match.provider || match.client || { id: "unknown", name: "Usuario", image: "" }
    }

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (matches.length === 0) {
        return (
            <div className="text-center p-12 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold">No tienes conversaciones activas</h3>
                <p className="text-muted-foreground">Cuando aceptes una propuesta o te contraten, aparecerá aquí.</p>
            </div>
        )
    }

    const otherUser = selectedMatch ? getOtherUser(selectedMatch) : null

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 flex-col md:flex-row">
            {/* Matches List */}
            <Card className="w-full md:w-1/3 flex flex-col">
                <CardHeader className="border-b px-4 py-3">
                    <CardTitle className="text-lg">Mensajes</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 p-2">
                        {matches.map((match) => {
                            const user = getOtherUser(match)
                            return (
                                <button
                                    key={match.id}
                                    onClick={() => handleSelectMatch(match)}
                                    className={cn(
                                        "flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                                        selectedMatch?.id === match.id && "bg-accent"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold truncate">{user.name}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(match.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate font-medium text-primary">
                                            {match.request.title}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            {selectedMatch && otherUser ? (
                <Card className="flex-1 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={otherUser.image} />
                                <AvatarFallback>{otherUser.name?.substring(0, 2) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{otherUser.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {selectedMatch.isCompleted ? "Trabajo Completado" : "En Progreso"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={handleWhatsAppClick} title="Contactar por WhatsApp">
                                <Phone className="h-4 w-4 text-green-600" />
                            </Button>
                            {/* Review Dialog only if completed or allowed */}
                            <ReviewDialog
                                matchId={selectedMatch.id}
                                targetName={otherUser.name}
                                trigger={
                                    <Button variant="ghost" size="icon" title="Calificar Usuario">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {/* System Message */}
                            <div className="flex justify-center">
                                <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Match confirmado. Puedes coordinar los detalles.
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
            ) : (
                <Card className="flex-1 flex items-center justify-center text-muted-foreground">
                    Selecciona una conversación para comenzar
                </Card>
            )}
        </div>
    )
}
