'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">¡Ups! Algo salió mal</h2>
        <p className="mb-6 max-w-sm">
            Ocurrió un error crítico. Por favor, intenta recargar la página.
        </p>
        <button
            onClick={() => reset()}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
            Intentar nuevamente
        </button>
    </div>
  )
}
