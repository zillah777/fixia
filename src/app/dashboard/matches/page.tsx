"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, CheckCircle2, Star, Loader2, AlertTriangle } from "lucide-react"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Match, Message, User } from "@/types/match"
import { useAuth } from "@/providers/auth-provider"
import { useParams, useRouter } from "next/navigation"

export default function MatchesPage() {
    const { user: currentUser } = useAuth()
    const params = useParams()
    const router = useRouter()
    const [matches, setMatches] = useState<Match[]>([])
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Poll for messages every 5 seconds
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (selectedMatch) {
            fetchMessages(selectedMatch.id)
            interval = setInterval(() => {
                fetchMessages(selectedMatch.id, true) // silent fetch
            }, 5000)
        }

        return () => clearInterval(interval)
    }, [selectedMatch])

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    useEffect(() => {
        const load = async () => {
            await fetchMatches()
        }
        load()
    }, [])

    const fetchMatches = async () => {
        try {
            const res = await fetch("/api/matches")
            if (res.ok) {
                const data: Match[] = await res.json()
                setMatches(data)

                // Deep link handling via URL params
                if (params?.id) {
                    const target = data.find(m => m.id === params.id)
                    if (target) {
                        // Don't set directly, use handleSelectMatch to fetch messages
                        setSelectedMatch(target)
                        setMessages([])
                        fetchMessages(target.id)
                        return
                    }
                }

                if (data.length > 0 && !selectedMatch) {
                    // Don't auto-select if on mobile maybe?
                    if (window.innerWidth > 768) {
                        handleSelectMatch(data[0])
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch matches", error)
            toast.error("Error al cargar conversaciones")
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (matchId: string, silent = false) => {
        try {
            const res = await fetch(`/api/messages?matchId=${matchId}`)
            if (res.ok) {
                const data: Message[] = await res.json()
                setMessages(data)
            }
        } catch (error) {
            if (!silent) console.error("Failed to fetch messages", error)
        }
    }

    const handleSelectMatch = (match: Match) => {
        setSelectedMatch(match)
        setMessages([]) // Clear previous messages while loading
        fetchMessages(match.id)

        // Update URL to match ID for better refreshing support (optional)
        // router.push(`/dashboard/matches/${match.id}`, { scroll: false })
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedMatch || sending) return

        const tempText = newMessage
        setNewMessage("")
        setSending(true)

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchId: selectedMatch.id,
                    text: tempText
                })
            })

            if (res.ok) {
                const savedMessage = await res.json()
                setMessages((prev) => [...prev, savedMessage])
            } else {
                throw new Error("Failed to send")
            }
        } catch (error) {
            toast.error("Error al enviar mensaje")
            setNewMessage(tempText) // Restore text on error
        } finally {
            setSending(false)
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
        if (!currentUser) return { id: "unknown", name: "Usuario", image: "" }
        return match.providerId === currentUser.id ? match.client! : match.provider!
    }

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    // Check for unrated matches
    const unratedMatchesCount = matches.filter(m =>
        m.isCompleted && !m.reviews?.some((r: any) => r.authorId === currentUser?.id)
    ).length

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
                {unratedMatchesCount >= 2 && (
                    <div className="bg-red-50 p-3 border-b border-red-100 flex items-start gap-2 animate-in slide-in-from-top-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-red-700">Acción Requerida</p>
                            <p className="text-[10px] text-red-600 leading-tight">
                                Tienes {unratedMatchesCount} trabajos sin calificar. No podrás contratar ni aceptar nuevos trabajos hasta calificarlos.
                            </p>
                        </div>
                    </div>
                )}
                <ScrollArea className="flex-1 h-[calc(100vh-15rem)] md:h-auto">
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
                                    <div className="relative shrink-0">
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 overflow-hidden min-w-0">
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

                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser?.id
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                                            isMe
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {msg.text}
                                        <span className={cn(
                                            "text-[10px]",
                                            isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                        )}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                )
                            })}
                            <div ref={scrollRef} />
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
                                disabled={sending}
                            />
                            <Button type="submit" size="icon" disabled={sending}>
                                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
