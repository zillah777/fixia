"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Bookings Page Error:", error)
    }, [error])

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center p-4">
            <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Algo salió mal al cargar las reservas</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Hubo un problema de conexión o una actualización reciente. Por favor, intenta recargar la página.
                </p>
                {error.message.includes("ChunkLoadError") && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                        Detectamos una actualización de versión. Una recarga debería solucionarlo.
                    </p>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recargar Página
                </Button>
                <Button onClick={() => reset()}>Intentar nuevamente</Button>
            </div>
        </div>
    )
}
