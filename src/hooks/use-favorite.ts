import { useState } from "react"
import { toast } from "sonner"

interface UseFavoriteOptions {
    type: "professional" | "service"
    id: string
    name?: string
}

interface UseFavoriteReturn {
    isFavorite: boolean
    isLoading: boolean
    toggleFavorite: () => Promise<void>
}

export function useFavorite({ type, id, name = "Item" }: UseFavoriteOptions): UseFavoriteReturn {
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const toggleFavorite = async () => {
        setIsLoading(true)
        try {
            if (isFavorite) {
                // TODO: Would need to fetch the favoriteId to delete it
                // For now, this is handled differently in components
                setIsFavorite(false)
                toast.success(`${name} removido de favoritos`)
            } else {
                const endpoint = type === "professional" ? "/api/favorites" : "/api/service-favorites"
                const body = type === "professional"
                    ? { professionalId: id }
                    : { serviceId: id }

                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                })

                if (res.ok) {
                    setIsFavorite(true)
                    toast.success(`${name} agregado a favoritos`)
                } else if (res.status === 401) {
                    window.location.href = "/login"
                } else {
                    toast.error("Error al agregar a favoritos")
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
            toast.error("Error al actualizar favoritos")
        } finally {
            setIsLoading(false)
        }
    }

    return { isFavorite, isLoading, toggleFavorite }
}
