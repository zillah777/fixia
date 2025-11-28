'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { logger } from '@/lib/logger'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        logger.error("Segment Error caught", error)
    }, [error])

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20 mb-4">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">¡Ups! Algo falló</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                No pudimos cargar esta sección correctamente. Por favor, intenta recargar.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    Intentar nuevamente
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Recargar página
                </Button>
            </div>
        </div>
    )
}
