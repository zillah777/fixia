"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { OnboardingStepProfile } from "./steps/onboarding-step-profile"
import { OnboardingStepServices } from "./steps/onboarding-step-services"
import { OnboardingStepVerification } from "./steps/onboarding-step-verification"
import { OnboardingStepSubscription } from "./steps/onboarding-step-subscription"
import { OnboardingStepWelcome } from "./steps/onboarding-step-welcome"

interface OnboardingWizardProps {
    user: User
}

export type OnboardingStep = "welcome" | "profile" | "services" | "subscription" | "verification" | "complete"

const PROFESSIONAL_STEPS: OnboardingStep[] = ["welcome", "profile", "services", "subscription", "verification", "complete"]
const CLIENT_STEPS: OnboardingStep[] = ["welcome", "profile", "complete"]

const STEP_LABELS: Record<OnboardingStep, string> = {
    welcome: "Bienvenida",
    profile: "Perfil",
    services: "Servicios",
    subscription: "Suscripción",
    verification: "Verificación",
    complete: "¡Listo!",
}

export function OnboardingWizard({ user }: OnboardingWizardProps) {
    const router = useRouter()
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const steps = user.role === "PROFESSIONAL" ? PROFESSIONAL_STEPS : CLIENT_STEPS
    const currentStep = steps[currentStepIndex]
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    const handleNext = async () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
            setError(null)
        } else {
            await completeOnboarding()
        }
    }

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
            setError(null)
        }
    }

    const handleStepError = (errorMsg: string) => {
        setError(errorMsg)
    }

    const completeOnboarding = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                throw new Error("Error al completar onboarding")
            }

            router.push("/dashboard")
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
            setIsLoading(false)
        }
    }

    const isLastStep = currentStepIndex === steps.length - 1
    const isWelcomeStep = currentStep === "welcome"
    const isCompleteStep = currentStep === "complete"

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Paso {currentStepIndex + 1} de {steps.length}
                        </h2>
                        <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Indicators */}
                <div className="mb-8 sm:mb-12 flex gap-2">
                    {steps.map((step, index) => (
                        <div key={step} className="flex items-center flex-1">
                            <button
                                onClick={() => {
                                    // Allow going back to previous steps, but not forward skipping steps
                                    if (index < currentStepIndex) {
                                        setCurrentStepIndex(index)
                                        setError(null)
                                    }
                                }}
                                className={`w-10 h-10 rounded-full font-semibold transition-all flex items-center justify-center ${
                                    index < currentStepIndex
                                        ? "bg-primary text-primary-foreground cursor-pointer"
                                        : index === currentStepIndex
                                          ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                          : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {index < currentStepIndex ? <Check className="h-5 w-5" /> : index + 1}
                            </button>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                                        index < currentStepIndex ? "bg-primary" : "bg-muted"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <Card className="border-border/40 shadow-lg">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-3xl">{STEP_LABELS[currentStep]}</CardTitle>
                        {!isWelcomeStep && !isCompleteStep && (
                            <CardDescription>
                                {currentStep === "profile" && "Completa tu información de perfil para que otros usuarios puedan conocerte mejor"}
                                {currentStep === "services" && "Añade los servicios que ofreces y tus detalles profesionales"}
                                {currentStep === "subscription" && "Elige el plan que se adapte a tus necesidades"}
                                {currentStep === "verification" && "Verifica tu identidad para acceder a todas las funciones"}
                            </CardDescription>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step Components */}
                        {currentStep === "welcome" && <OnboardingStepWelcome user={user} />}
                        {currentStep === "profile" && (
                            <OnboardingStepProfile user={user} onError={handleStepError} />
                        )}
                        {currentStep === "services" && user.role === "PROFESSIONAL" && (
                            <OnboardingStepServices user={user} onError={handleStepError} />
                        )}
                        {currentStep === "subscription" && user.role === "PROFESSIONAL" && (
                            <OnboardingStepSubscription user={user} onError={handleStepError} />
                        )}
                        {currentStep === "verification" && user.role === "PROFESSIONAL" && (
                            <OnboardingStepVerification user={user} onError={handleStepError} />
                        )}
                        {currentStep === "complete" && (
                            <div className="py-12 text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Check className="h-10 w-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">¡Bienvenido a Fixia!</h3>
                                    <p className="text-muted-foreground">
                                        Tu perfil está listo. Ahora puedes acceder a todas las funciones de la plataforma.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-6">
                            {!isWelcomeStep && !isCompleteStep && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={isLoading}
                                >
                                    Anterior
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                disabled={isLoading}
                                className="ml-auto"
                            >
                                {isCompleteStep ? (
                                    <>
                                        Ir al Dashboard
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Skip Option (except on last steps) */}
                {!isCompleteStep && currentStepIndex > 0 && user.role === "CLIENT" && (
                    <div className="text-center mt-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                        >
                            Saltar al dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
