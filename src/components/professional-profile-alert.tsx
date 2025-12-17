"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, BookOpen, Award, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import prisma from "@/lib/prisma"

export function ProfessionalProfileAlert() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user?.id && user?.role === "PROFESSIONAL") {
            // Check if professional has completed profile
            fetch(`/api/users/profile`)
                .then(res => res.json())
                .then(data => {
                    setProfileData(data)
                })
                .finally(() => setIsLoading(false))
        }
    }, [user])

    if (!user || user.role !== "PROFESSIONAL" || isLoading) {
        return null
    }

    // Check if profile is incomplete
    const isProfileIncomplete = !profileData?.yearsExperience ||
        !profileData?.education ||
        !profileData?.bio

    if (!isProfileIncomplete) {
        return null
    }

    return (
        <Card className="border-amber-200 bg-amber-50 mb-6">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base text-amber-900">
                                Completa tu perfil profesional
                            </CardTitle>
                            <p className="text-sm text-amber-700 mt-1">
                                Tu perfil incompleto reduce tu visibilidad y confianza de clientes
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${profileData?.yearsExperience ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                            <BookOpen className="h-4 w-4" />
                            <span>Experiencia</span>
                            {profileData?.yearsExperience && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${profileData?.education ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                            <Award className="h-4 w-4" />
                            <span>Educación</span>
                            {profileData?.education && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${profileData?.bio ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                            <Shield className="h-4 w-4" />
                            <span>Descripción</span>
                            {profileData?.bio && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Link href="/dashboard/profile" className="flex-1">
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                                Completar perfil
                            </Button>
                        </Link>
                        <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                            Recordarme después
                        </Button>
                    </div>

                    <p className="text-xs text-amber-600 text-center mt-2">
                        ✨ Los perfiles completos reciben 3x más solicitudes de clientes
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
