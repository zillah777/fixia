"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        // Check if user has already accepted cookies
        const cookieConsent = localStorage.getItem('cookie-consent')
        if (!cookieConsent) {
            setShowBanner(true)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setShowBanner(false)
    }

    const declineCookies = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <Cookie className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">Usamos cookies</h3>
                            <p className="text-sm text-muted-foreground">
                                Utilizamos cookies para mejorar tu experiencia, mantener tu sesión segura y analizar el uso de la plataforma.
                                Al continuar navegando, aceptas nuestra{' '}
                                <Link href="/cookies" className="text-primary hover:underline">
                                    Política de Cookies
                                </Link>
                                {' '}y{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Política de Privacidad
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={declineCookies}
                            className="flex-1 sm:flex-none"
                        >
                            Rechazar
                        </Button>
                        <Button
                            size="sm"
                            onClick={acceptCookies}
                            className="flex-1 sm:flex-none"
                        >
                            Aceptar
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={declineCookies}
                            className="hidden sm:flex"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
