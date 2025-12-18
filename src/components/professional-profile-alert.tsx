"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, BookOpen, Award, Shield, Lock, User, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ProfessionalProfileAlert() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<any>(null)
    const [verificationData, setVerificationData] = useState<any>(null)
    const [certificationsData, setCertificationsData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem(`dismissed_pro_profile_alert_${user?.id}`)
        if (dismissed === "true") {
            setIsDismissed(true)
        }
    }, [user?.id])

    const handleDismiss = () => {
        localStorage.setItem(`dismissed_pro_profile_alert_${user?.id}`, "true")
        setIsDismissed(true)
    }

    useEffect(() => {
        if (user?.id && user?.role === "PROFESSIONAL") {
            // Fetch profile data
            Promise.all([
                fetch(`/api/users/profile`).then(res => res.json()),
                fetch(`/api/verifications`).then(res => res.json()),
                fetch(`/api/certifications`).then(res => res.json()),
            ])
                .then(([profile, verification, certifications]) => {
                    setProfileData(profile)
                    setVerificationData(verification)
                    setCertificationsData(certifications)
                })
                .finally(() => setIsLoading(false))
        }
    }, [user])

    if (!user || user.role !== "PROFESSIONAL" || isLoading || isDismissed) {
        return null
    }

    // Check completion status - INCLUDE DATA FROM REGISTRATION
    // Note: yearsExperience, education, bio are saved during registration in the profile relation
    const hasExperience = (profileData?.profile?.yearsExperience > 0) || !!profileData?.profile?.experienceDetails
    const hasEducation = !!profileData?.profile?.education || !!profileData?.profile?.diploma
    const hasBio = !!profileData?.profile?.bio || !!profileData?.profile?.description
    const profileComplete = hasExperience && hasEducation && hasBio

    const dniVerified = verificationData?.status === "APPROVED"
    const hasCertification = certificationsData?.certifications?.some((c: any) => c.status === "APPROVED")
    const hasPhoto = profileData?.avatar

    const needsPhoto = !hasPhoto
    const needsIdentityVerification = !dniVerified
    const needsCertifications = !hasCertification
    const isComplete = !needsPhoto && !needsIdentityVerification && !needsCertifications

    // We show the congrats message if complete, even if all items are done

    // Calculate profile strength - 3 visible items (profileComplete is still checked internally but not shown)
    const completedItems = [hasPhoto, dniVerified, hasCertification].filter(Boolean).length
    const totalItems = 3
    const completionPercentage = Math.round((completedItems / totalItems) * 100)

    return (
        <Card className={`mb-6 border-2 transition-all ${isComplete ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-green-100' : 'bg-blue-100'}`}>
                            {isComplete ? (
                                <CheckCircle2 className="h-6 w-6 text-green-600 animate-bounce" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <CardTitle className={`text-base ${isComplete ? 'text-green-900' : 'text-blue-900'}`}>
                                {isComplete ? "¡Excelente! Perfil verificado al 100%" : `Aumenta tu perfil a ${completionPercentage}% de confianza`}
                            </CardTitle>
                            <p className="text-sm text-blue-700 mt-1">
                                {isComplete
                                    ? "Ya tienes el máximo nivel de visibilidad. ¡A trabajar!"
                                    : "Los perfiles verificados reciben 5x más solicitudes de clientes"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-400 hover:text-blue-600"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className={`w-full rounded-full h-2 ${isComplete ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    {!isComplete && (
                        <>
                            {/* Completion Items Grid - 3 visible items */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {/* Photo */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${hasPhoto ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-blue-100 text-gray-600'}`}>
                                    <User className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1">Foto de perfil</span>
                                    {hasPhoto ? (
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                        <span className="text-xs font-medium">Pendiente</span>
                                    )}
                                </div>

                                {/* DNI Verification */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${dniVerified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-blue-100 text-gray-600'}`}>
                                    <Shield className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1">DNI verificado</span>
                                    {dniVerified ? (
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                        <span className="text-xs font-medium">Pendiente</span>
                                    )}
                                </div>

                                {/* Certifications */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${hasCertification ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-blue-100 text-gray-600'}`}>
                                    <Award className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-1">Certificaciones</span>
                                    {hasCertification ? (
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                        <span className="text-xs font-medium">Pendiente</span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                {!hasPhoto && (
                                    <Link href="/dashboard/settings" className="flex-1">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            Agregar foto
                                        </Button>
                                    </Link>
                                )}
                                {!dniVerified && (
                                    <Link href="/dashboard/settings" className="flex-1">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                            <Lock className="h-4 w-4 mr-2" />
                                            Verificar DNI
                                        </Button>
                                    </Link>
                                )}
                                {!hasCertification && (
                                    <Link href="/dashboard/settings?tab=certifications" className="flex-1">
                                        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                            Agregar certificaciones
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <p className="text-xs text-blue-600 text-center mt-3 font-medium">
                                ✨ Verificación: {completionPercentage}% → Máxima visibilidad en marketplace
                            </p>
                        </>
                    )}

                    {isComplete && (
                        <div className="flex justify-center">
                            <Link href="/dashboard/settings">
                                <Button variant="link" className="text-green-600 font-medium">
                                    Ver mis certificaciones
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
