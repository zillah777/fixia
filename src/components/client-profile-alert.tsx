"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, User, Mail, Shield, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function ClientProfileAlert() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem(`dismissed_client_profile_alert_${user?.id}`)
        if (dismissed === "true") {
            setIsDismissed(true)
        }
    }, [user?.id])

    const handleDismiss = () => {
        localStorage.setItem(`dismissed_client_profile_alert_${user?.id}`, "true")
        setIsDismissed(true)
    }

    useEffect(() => {
        if (user?.id && user?.role === "CLIENT") {
            // Fetch profile data
            fetch(`/api/users/profile`)
                .then(res => res.json())
                .then(data => {
                    console.log('Profile data:', data); // Debug: see what we're getting
                    setProfileData(data)
                })
                .finally(() => setIsLoading(false))
        }
    }, [user])

    if (!user || user.role !== "CLIENT" || isLoading || isDismissed) {
        return null
    }

    // Check completion status
    const avatarValue = profileData?.avatar || user?.avatar
    const hasPhoto = Boolean(avatarValue && typeof avatarValue === 'string' && avatarValue.trim() !== "")

    // Check DNI verification - look at verificationRequest status
    const dniVerified = profileData?.verificationRequest?.status === "APPROVED"

    const hasBio = profileData?.profile?.bio || profileData?.profile?.description
    const hasPhone = profileData?.phone

    // Parse socialLinks (es un string JSON) - check in profile
    let socialLinks: any = {}
    try {
        const socialLinksStr = profileData?.profile?.socialLinks
        socialLinks = socialLinksStr ? JSON.parse(socialLinksStr) : {}
    } catch (e) {
        socialLinks = {}
    }

    // Verificar que tenga al menos una red social con valor
    const hasSocialLinks = Boolean(
        socialLinks?.linkedin ||
        socialLinks?.instagram ||
        socialLinks?.facebook ||
        socialLinks?.twitter ||
        socialLinks?.tiktok ||
        socialLinks?.youtube
    )

    const profileDataComplete = hasBio && hasPhone && hasSocialLinks

    const needsPhoto = !hasPhoto
    const needsDniVerification = !dniVerified
    const needsProfileData = !profileDataComplete
    const isComplete = !needsPhoto && !needsDniVerification && !needsProfileData

    // If complete and NOT dismissed, we show the congrats instead of returning null
    // But we will handle that in the render

    // Calculate profile strength - 3 items for clients
    const completionItems = [
        { done: hasPhoto, label: "Foto de perfil" },
        { done: dniVerified, label: "Verificación de identidad" },
        { done: profileDataComplete, label: "Bio y Redes" },
    ]

    const completionPercentage = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100)

    return (
        <Card className={`mb-6 border-2 transition-all ${isComplete ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-green-100' : 'bg-emerald-100'}`}>
                            {isComplete ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 animate-bounce" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-emerald-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <CardTitle className={`text-base ${isComplete ? 'text-green-900' : 'text-emerald-900'}`}>
                                {isComplete ? "¡Felicitaciones! Perfil al 100%" : `Completa tu perfil al ${completionPercentage}%`}
                            </CardTitle>
                            <p className={`text-sm mt-1 ${isComplete ? 'text-green-700' : 'text-emerald-700'}`}>
                                {isComplete
                                    ? "Tu perfil es ahora mucho más confiable para los profesionales."
                                    : "Los perfiles completos reciben mejor atención de profesionales"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-600"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className={`w-full rounded-full h-2 ${isComplete ? 'bg-green-100' : 'bg-emerald-100'}`}>
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    {!isComplete && (
                        <>
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

                                {/* DNI Verification */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${dniVerified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-emerald-100 text-gray-600'}`}>
                                    <Shield className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1">Verificación de identidad</span>
                                    {dniVerified ? (
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                        <span className="text-xs font-medium">Pendiente</span>
                                    )}
                                </div>

                                {/* Bio and Social Links */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${profileDataComplete ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-emerald-100 text-gray-600'}`}>
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1">Bio y Redes</span>
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
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Completar perfil
                                        </Button>
                                    </Link>
                                )}
                                {needsDniVerification && (
                                    <Link href="/dashboard/verification" className="flex-1">
                                        <Button className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 border">
                                            Verificar identidad
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <p className="text-xs text-emerald-600 text-center mt-3 font-medium">
                                ✨ Perfil completo: {completionPercentage}% → Profesionales responden más rápido
                            </p>
                        </>
                    )}

                    {isComplete && (
                        <div className="flex justify-center">
                            <Link href="/dashboard/settings">
                                <Button variant="link" className="text-green-600 font-medium">
                                    Ver mi perfil completo
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
