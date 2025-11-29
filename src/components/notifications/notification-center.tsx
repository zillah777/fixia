"use client"

import * as React from "react"
import { Bell, X, Check, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Notification {
    id: string
    title: string
    message: string
    type: "success" | "error" | "warning" | "info"
    timestamp: Date
    read: boolean
    action?: {
        label: string
        onClick: () => void
    }
}

export function NotificationCenter() {
    const [notifications, setNotifications] = React.useState<Notification[]>([
        {
            id: "1",
            title: "Nueva solicitud recibida",
            message: "Cliente nuevo solicitó tu servicio de plomería",
            type: "info",
            timestamp: new Date(Date.now() - 5 * 60000),
            read: false,
            action: { label: "Ver solicitud", onClick: () => {} },
        },
        {
            id: "2",
            title: "Servicio completado",
            message: "Tu servicio en Av. Principal fue completado exitosamente",
            type: "success",
            timestamp: new Date(Date.now() - 30 * 60000),
            read: false,
        },
        {
            id: "3",
            title: "Perfil verificado",
            message: "Tus documentos han sido verificados correctamente",
            type: "success",
            timestamp: new Date(Date.now() - 2 * 60 * 60000),
            read: true,
        },
    ])

    const unreadCount = notifications.filter((n) => !n.read).length

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }

    const handleDelete = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return <Check className="h-5 w-5 text-green-500" />
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-500" />
            case "warning":
                return <AlertCircle className="h-5 w-5 text-amber-500" />
            case "info":
                return <Info className="h-5 w-5 text-blue-500" />
        }
    }

    const getBackgroundColor = (type: Notification["type"], read: boolean) => {
        if (read) return "bg-background hover:bg-muted/50"
        switch (type) {
            case "success":
                return "bg-green-50 dark:bg-green-900/20 hover:bg-green-100/50 dark:hover:bg-green-900/40"
            case "error":
                return "bg-red-50 dark:bg-red-900/20 hover:bg-red-100/50 dark:hover:bg-red-900/40"
            case "warning":
                return "bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100/50 dark:hover:bg-amber-900/40"
            case "info":
                return "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/40"
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "Hace un momento"
        if (minutes < 60) return `Hace ${minutes}m`
        if (hours < 24) return `Hace ${hours}h`
        if (days < 7) return `Hace ${days}d`
        return date.toLocaleDateString("es-ES")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                            variant="destructive"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="font-semibold">Notificaciones</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs"
                        >
                            Marcar todo como leído
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[500px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border-b last:border-b-0 p-4 cursor-pointer transition-colors ${getBackgroundColor(
                                    notification.type,
                                    notification.read
                                )}`}
                                onClick={() => handleMarkAsRead(notification.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(notification.id)
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(notification.timestamp)}
                                            </span>
                                            {!notification.read && (
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        {notification.action && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="mt-2 h-auto p-0 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    notification.action?.onClick()
                                                }}
                                            >
                                                {notification.action.label} →
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">No hay notificaciones</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t p-3">
                        <Button
                            variant="outline"
                            className="w-full text-xs"
                            size="sm"
                        >
                            Ver todas las notificaciones
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
