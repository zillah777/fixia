"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, User, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
                    console.log('Profile data:', data); // Debug: see what we're getting
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

    // Check if alert should show
    const needsPhoto = !hasPhoto
    const needsDniVerification = !dniVerified
    const needsProfileData = !profileDataComplete

    if (!needsPhoto && !needsDniVerification && !needsProfileData) {
        return null
    }

    // Calculate profile strength - 3 items for clients
    const completionItems = [
        { done: hasPhoto, label: "Foto de perfil" },
        { done: dniVerified, label: "Verificación de identidad" },
        { done: profileDataComplete, label: "Bio y Redes" },
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
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
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
                </div>
            </CardContent>
        </Card>
    )
}
