"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, CheckCircle2, Star, Loader2, AlertTriangle, ArrowLeft, MessageCircle } from "lucide-react"
import { ReviewDialog } from "@/components/reviews/review-dialog"
import { WorkCompletionForm } from "@/components/match/work-completion-form"
import { RatingGate } from "@/components/match/rating-gate"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import { Match, Message, User } from "@/types/match"
import { useAuth } from "@/providers/auth-provider"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getAvatarUrl, getInitials } from "@/lib/avatar-utils"

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
    const [showChatOnMobile, setShowChatOnMobile] = useState(false)
    const [ratingRefreshTrigger, setRatingRefreshTrigger] = useState(0)
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
                const response = await res.json()
                const data: Match[] = response.data || response
                setMatches(Array.isArray(data) ? data : [])

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
        setShowChatOnMobile(true) // Show chat on mobile

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
            } else if (res.status === 410) {
                // Match is closed - both users have rated
                const error = await res.json()
                toast.error(error.error || "Esta conversación ha finalizado")
                // Refresh to update UI
                setRatingRefreshTrigger(prev => prev + 1)
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

    // Check for unrated matches (defensive checks for reviews)
    const unratedMatchesCount = matches.filter(m => {
        if (!m.isCompleted) return false
        const reviews = Array.isArray(m.reviews) ? m.reviews : []
        return !reviews.some((r: any) => r.authorId === currentUser?.id)
    }).length

    // Check if both users have reviewed each other (defensive)
    const haveMutualReviews = (match: Match): boolean => {
        const reviews = Array.isArray(match.reviews) ? match.reviews : []
        if (reviews.length < 2) return false
        const clientReviewed = reviews.some((r: any) => r.authorId === match.clientId)
        const providerReviewed = reviews.some((r: any) => r.authorId === match.providerId)
        return clientReviewed && providerReviewed
    }

    if (matches.length === 0) {
        return (
            <StandardizedEmptyState
                icon={MessageCircle}
                title="No tienes conversaciones"
                description={currentUser?.role === 'PROFESSIONAL'
                    ? "Envía propuestas a solicitudes activas para iniciar conversaciones con clientes."
                    : "Crea una solicitud para recibir propuestas de profesionales y comenzar a chatear."}
                action={{
                    label: currentUser?.role === 'PROFESSIONAL' ? "Ver Oportunidades" : "Crear Solicitud",
                    onClick: () => {
                        router.push(currentUser?.role === 'PROFESSIONAL' ? "/dashboard/opportunities" : "/create-request")
                    },
                }}
            />
        )
    }

    const otherUser = selectedMatch ? getOtherUser(selectedMatch) : null
    const canViewProfile = selectedMatch ? haveMutualReviews(selectedMatch) : false

    return (
        <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] gap-2 md:gap-4 flex-col md:flex-row">
            {/* Matches List - Hide on mobile when chat is open */}
            <Card className={cn(
                "w-full md:w-1/3 flex flex-col",
                showChatOnMobile && "hidden md:flex"
            )}>
                <CardHeader className="border-b px-4 py-3">
                    <CardTitle className="text-lg">Mensajes</CardTitle>
                </CardHeader>
                {unratedMatchesCount >= 2 && (
                    <div className="bg-destructive/5 p-3 border-b border-red-100 flex items-start gap-2 animate-in slide-in-from-top-2">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-destructive">Acción Requerida</p>
                            <p className="text-[10px] text-destructive leading-tight">
                                Tienes {unratedMatchesCount} trabajos sin calificar. No podrás contratar ni aceptar nuevos trabajos hasta calificarlos.
                            </p>
                        </div>
                    </div>
                )}
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-1 p-2">
                        {matches.map((match) => {
                            const user = getOtherUser(match)
                            return (
                                <button
                                    key={match.id}
                                    onClick={() => handleSelectMatch(match)}
                                    className={cn(
                                        "flex items-start gap-3 rounded-lg p-4 text-left transition-colors hover:bg-accent active:bg-accent/80 touch-manipulation",
                                        selectedMatch?.id === match.id && "bg-accent"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={getAvatarUrl(user.image || user.avatar, user.name)} />
                                            <AvatarFallback>{getInitials(user.name || "User")}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 overflow-hidden min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold truncate text-base">{user.name}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(match.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate font-medium text-primary mt-1">
                                            {match.request.title}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area - Show on mobile when selected */}
            {selectedMatch && otherUser ? (
                <Card className={cn(
                    "flex-1 flex flex-col overflow-hidden",
                    !showChatOnMobile && "hidden md:flex"
                )}>
                    {/* Chat Header */}
                    <div className="border-b bg-muted/30 px-4 py-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                {/* Back button for mobile */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => setShowChatOnMobile(false)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                {canViewProfile ? (
                                    <Link href={`/dashboard/profile/${otherUser.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity" title="Ver perfil">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={getAvatarUrl(otherUser.image || otherUser.avatar, otherUser.name)} />
                                            <AvatarFallback>{getInitials(otherUser.name || "User")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-base hover:underline">{otherUser.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {selectedMatch.isCompleted ? "Trabajo Completado" : "En Progreso"}
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={getAvatarUrl(otherUser.image || otherUser.avatar, otherUser.name)} />
                                            <AvatarFallback>{getInitials(otherUser.name || "User")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold text-base">{otherUser.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {selectedMatch.isCompleted ? "Trabajo Completado" : "En Progreso"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" size="icon" onClick={handleWhatsAppClick} title="Contactar por WhatsApp" className="touch-manipulation">
                                    <Phone className="h-4 w-4 text-accent" />
                                </Button>
                                {/* Review Dialog only if completed or allowed */}
                                <ReviewDialog
                                    matchId={selectedMatch.id}
                                    targetName={otherUser.name}
                                    targetId={otherUser.id}
                                    trigger={
                                        <Button variant="ghost" size="icon" title="Calificar Usuario" className="touch-manipulation">
                                            <Star className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </div>
                        </div>

                        {/* Work Completion Form */}
                        <WorkCompletionForm
                            matchId={selectedMatch.id}
                            isCompleted={selectedMatch.isCompleted}
                            clientId={selectedMatch.clientId}
                            providerId={selectedMatch.providerId}
                            currentUserId={currentUser?.id || ""}
                            providerApprovedCompletion={selectedMatch.providerApprovedCompletion}
                            clientApprovedCompletion={selectedMatch.clientApprovedCompletion}
                        />

                        {/* Rating Gate - Show after work is completed */}
                        {selectedMatch.isCompleted && (
                            <RatingGate
                                matchId={selectedMatch.id}
                                clientId={selectedMatch.clientId}
                                providerId={selectedMatch.providerId}
                                currentUserId={currentUser?.id || ""}
                                refreshTrigger={ratingRefreshTrigger}
                                onBothRated={() => {
                                    fetchMatches()
                                }}
                            />
                        )}
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-2 md:p-4">
                        <div className="space-y-2 md:space-y-4">
                            {/* System Message */}
                            <div className="flex justify-center">
                                <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-2 md:px-3 rounded-full flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="text-[11px] md:text-xs">Match confirmado. Puedes coordinar los detalles.</span>
                                </div>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser?.id
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex w-max max-w-[85%] md:max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm break-words",
                                            isMe
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        <span className="break-words">{msg.text}</span>
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
                    <div className="p-3 md:p-4 border-t bg-background">
                        {selectedMatch.isCompleted && haveMutualReviews(selectedMatch) ? (
                            <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Conversación finalizada. Ambos usuarios han completado las calificaciones.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 min-h-[44px]"
                                    disabled={sending}
                                />
                                <Button type="submit" size="icon" disabled={sending} className="min-h-[44px] min-w-[44px]">
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    <span className="sr-only">Enviar</span>
                                </Button>
                            </form>
                        )}
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
