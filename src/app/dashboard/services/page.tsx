"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServicesManager } from "@/components/settings/services-manager"
import { Separator } from "@/components/ui/separator"
import { Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ServicesPage() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user && user.role !== 'PROFESSIONAL') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (!user || user.role !== 'PROFESSIONAL') {
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-6 w-6" />
                    <h3 className="text-2xl font-bold tracking-tight">Mis Servicios</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Administra los servicios que ofreces a los clientes. Estos aparecerán en el catálogo público.
                </p>
            </div>
            <Separator />

            <ServicesManager />
        </div>
    )
}
