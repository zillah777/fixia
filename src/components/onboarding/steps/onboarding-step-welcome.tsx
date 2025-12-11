"use client"

import { User } from "@prisma/client"
import { Briefcase, Users, Star, CheckCircle2 } from "lucide-react"

interface OnboardingStepWelcomeProps {
    user: User
}

export function OnboardingStepWelcome({ user }: OnboardingStepWelcomeProps) {
    const isProfessional = user.role === "PROFESSIONAL"

    const features = isProfessional
        ? [
              {
                  icon: Briefcase,
                  title: "Gestiona tus servicios",
                  description: "Crea y administra los servicios que ofreces",
              },
              {
                  icon: Users,
                  title: "Conecta con clientes",
                  description: "Recibe solicitudes de clientes interesados",
              },
              {
                  icon: Star,
                  title: "Construye reputación",
                  description: "Gana calificaciones y reseñas de tus clientes",
              },
              {
                  icon: CheckCircle2,
                  title: "Crece tu negocio",
                  description: "Aumenta tu visibilidad y oportunidades",
              },
          ]
        : [
              {
                  icon: Users,
                  title: "Encuentra profesionales",
                  description: "Explora profesionales verificados en tu área",
              },
              {
                  icon: Briefcase,
                  title: "Crea solicitudes",
                  description: "Describe el trabajo que necesitas realizar",
              },
              {
                  icon: Star,
                  title: "Califica tu experiencia",
                  description: "Comparte reseñas sobre los profesionales",
              },
              {
                  icon: CheckCircle2,
                  title: "Confía en la plataforma",
                  description: "Todos nuestros profesionales están verificados",
              },
          ]

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold">
                    {isProfessional
                        ? "¡Bienvenido, profesional!"
                        : "¡Bienvenido a Fixia!"}
                </h3>
                <p className="text-muted-foreground">
                    {isProfessional
                        ? "Estamos emocionados de tener profesionales de calidad en nuestra plataforma. Aquí te guiaremos a través de los pasos iniciales para que comiences a recibir solicitudes."
                        : "Estamos emocionados de ayudarte a encontrar profesionales de confianza. Aquí te guiaremos a través de los pasos iniciales para que disfrutes de nuestros servicios."}
                </p>
            </div>

            <div className="grid gap-4">
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <div
                            key={feature.title}
                            className="p-4 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="p-4 rounded-xl border border-border/40 bg-primary/5">
                <p className="text-sm text-foreground">
                    <span className="font-semibold">💡 Tip:</span> Este proceso toma apenas 5-10 minutos. Puedes editar tu información en cualquier momento desde tu perfil.
                </p>
            </div>
        </div>
    )
}
