'use client'

import { useEffect } from "react"
import { logger } from "@/lib/logger"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        logger.error("Global Error caught", error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
                    <div className="max-w-md text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight">Algo salió mal</h1>
                        <p className="text-muted-foreground">
                            Ha ocurrido un error crítico en la aplicación. Nuestro equipo ha sido notificado.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
