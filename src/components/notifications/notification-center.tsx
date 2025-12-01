"use client"

import * as React from "react"
import { Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export interface Notification {
    id: string
    type: string
    message: string
    isRead: boolean
    actionUrl?: string
    createdAt: string
}

export function NotificationCenter() {
    const [notifications, setNotifications] = React.useState<Notification[]>([])
    const [isOpen, setIsOpen] = React.useState(false)
    const router = useRouter()

    const fetchNotifications = React.useCallback(async () => {
        try {
            const res = await fetch("/api/notifications")
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }, [])

    React.useEffect(() => {
        fetchNotifications()
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    const unreadCount = notifications.filter(n => !n.isRead).length

    // Effect to detect new unread notifications and play sound
    React.useEffect(() => {
        if (unreadCount > 0) {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.5
            audio.play().catch(() => { })
        }
    }, [unreadCount])

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        } catch (error) {
            toast.error("Error al marcar como leída")
        }
    }

    const markAllAsRead = async () => {
        // Optimistic update
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))

        try {
            await Promise.all(unreadIds.map(id => fetch(`/api/notifications/${id}`, { method: "PATCH" })))
            toast.success("Todas las notificaciones marcadas como leídas")
        } catch (error) {
            toast.error("Error al actualizar")
            fetchNotifications() // Revert on error
        }
    }

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await fetch(`/api/notifications/${id}`, { method: "DELETE" })
            setNotifications(prev => prev.filter(n => n.id !== id))
            toast.success("Notificación eliminada")
        } catch (error) {
            toast.error("Error al eliminar")
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id)
        }
        if (notification.actionUrl) {
            setIsOpen(false)
            router.push(notification.actionUrl)
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-white animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-gray-100">
                <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-bold text-base">Notificaciones</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-600 h-auto p-0 hover:bg-transparent hover:text-blue-700"
                            onClick={markAllAsRead}
                        >
                            Marcar todo leído
                        </Button>
                    )}
                </DropdownMenuLabel>
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No tienes notificaciones</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-gray-50 border-b border-gray-50 last:border-0",
                                        !notification.isRead && "bg-blue-50/50"
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex w-full justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {!notification.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                                            )}
                                            <span className="font-medium text-sm text-gray-900 line-clamp-1">
                                                {notification.type === 'MATCH' ? '¡Nuevo Match!' :
                                                    notification.type === 'SYSTEM' ? 'Sistema' :
                                                        notification.type}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-snug">
                                        {notification.message}
                                    </p>
                                    <div className="flex w-full justify-end mt-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                            onClick={(e) => deleteNotification(notification.id, e)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2 bg-gray-50 text-center">
                    <Button variant="link" size="sm" className="text-xs text-muted-foreground w-full h-auto">
                        Ver historial completo
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
