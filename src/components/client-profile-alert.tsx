"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, User, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ClientProfileAlert() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user?.id && user?.role === "CLIENT") {
            // Fetch profile data
            fetch(`/api/users/profile`)
                .then(res => res.json())
                .then(data => {
                    setProfileData(data)
                })
                .finally(() => setIsLoading(false))
        }
    }, [user])

    if (!user || user.role !== "CLIENT" || isLoading) {
        return null
    }

    // Check completion status
    const hasPhoto = profileData?.avatar
    const emailVerified = profileData?.status === "VERIFIED" || user?.emailVerified
    const profileDataComplete = profileData?.bio && profileData?.phone

    // Check if alert should show
    const needsPhoto = !hasPhoto
    const needsEmailVerification = !emailVerified
    const needsProfileData = !profileDataComplete

    if (!needsPhoto && !needsEmailVerification && !needsProfileData) {
        return null
    }

    // Calculate profile strength
    const completionItems = [
        { done: hasPhoto, label: "Foto de perfil" },
        { done: emailVerified, label: "Email verificado" },
        { done: profileDataComplete, label: "Datos personales" },
    ]

    const completionPercentage = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100)

    return (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 mb-6 border-2">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-base text-emerald-900">
                                Completa tu perfil al {completionPercentage}%
                            </CardTitle>
                            <p className="text-sm text-emerald-700 mt-1">
                                Los perfiles completos reciben mejor atención de profesionales
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    {/* Completion Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        {/* Photo */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${hasPhoto ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-emerald-100 text-gray-600'}`}>
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">Foto de perfil</span>
                            {hasPhoto ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            ) : (
                                <span className="text-xs font-medium">Pendiente</span>
                            )}
                        </div>

                        {/* Email Verification */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${emailVerified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-emerald-100 text-gray-600'}`}>
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">Email verificado</span>
                            {emailVerified ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            ) : (
                                <span className="text-xs font-medium">Pendiente</span>
                            )}
                        </div>

                        {/* Personal Data */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${profileDataComplete ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-emerald-100 text-gray-600'}`}>
                            <Shield className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">Datos personales</span>
                            {profileDataComplete ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            ) : (
                                <span className="text-xs font-medium">Pendiente</span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {(needsPhoto || needsProfileData) && (
                            <Link href="/dashboard/settings" className="flex-1">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Completar perfil
                                </Button>
                            </Link>
                        )}
                        {needsEmailVerification && (
                            <Button
                                variant="outline"
                                className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                onClick={() => {
                                    // Trigger email verification resend
                                    fetch('/api/auth/resend-verification', { method: 'POST' })
                                        .then(r => r.json())
                                        .then(d => {
                                            if (d.success) {
                                                alert('Email de verificación reenviado')
                                            }
                                        })
                                }}
                            >
                                Verificar email
                            </Button>
                        )}
                    </div>

                    <p className="text-xs text-emerald-600 text-center mt-3 font-medium">
                        ✨ Perfil completo: {completionPercentage}% → Profesionales responden más rápido
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
