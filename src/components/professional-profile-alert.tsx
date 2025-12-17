"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, BookOpen, Award, Shield, Lock, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function ProfessionalProfileAlert() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<any>(null)
    const [verificationData, setVerificationData] = useState<any>(null)
    const [certificationsData, setCertificationsData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

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

    if (!user || user.role !== "PROFESSIONAL" || isLoading) {
        return null
    }

    // Check completion status
    const profileComplete = profileData?.yearsExperience && profileData?.education && profileData?.bio
    const dniVerified = verificationData?.status === "APPROVED"
    const hasCertification = certificationsData?.certifications?.some((c: any) => c.status === "APPROVED")
    const hasPhoto = profileData?.avatar

    // Check if alert should show
    const needsProfileCompletion = !profileComplete
    const needsIdentityVerification = !dniVerified
    const needsPhoto = !hasPhoto

    if (!needsProfileCompletion && !needsIdentityVerification && !needsPhoto) {
        return null
    }

    // Calculate profile strength
    const completionItems = [
        { done: profileComplete, label: "Perfil completo" },
        { done: dniVerified, label: "Identidad verificada" },
        { done: hasCertification, label: "Certificaciones verificadas" },
        { done: hasPhoto, label: "Foto de perfil" },
    ]

    const completionPercentage = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100)

    return (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6 border-2">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-base text-blue-900">
                                Aumenta tu perfil a {completionPercentage}% de confianza
                            </CardTitle>
                            <p className="text-sm text-blue-700 mt-1">
                                Los perfiles verificados reciben 5x más solicitudes de clientes
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    {/* Completion Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {/* Profile Completion */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${profileComplete ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-blue-100 text-gray-600'}`}>
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">Perfil completo</span>
                            {profileComplete ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            ) : (
                                <span className="text-xs font-medium">Pendiente</span>
                            )}
                        </div>

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
                                <span className="text-xs font-medium">Opcional</span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {!profileComplete && (
                            <Link href="/dashboard/settings" className="flex-1">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Completar perfil
                                </Button>
                            </Link>
                        )}
                        {!dniVerified && (
                            <Link href="/dashboard/settings" className="flex-1">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Verificar DNI
                                </Button>
                            </Link>
                        )}
                        {!hasPhoto && (
                            <Link href="/dashboard/settings" className="flex-1">
                                <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                                    Agregar foto
                                </Button>
                            </Link>
                        )}
                    </div>

                    <p className="text-xs text-blue-600 text-center mt-3 font-medium">
                        ✨ Verificación: {completionPercentage}% → Máxima visibilidad en marketplace
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
