"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface HelpTopic {
    id: string
    title: string
    description: string
    tips: string[]
    examples?: string[]
}

interface HelpDrawerProps {
    trigger?: React.ReactNode
    topics?: HelpTopic[]
    defaultTopic?: string
}

const DEFAULT_TOPICS: HelpTopic[] = [
    {
        id: "profile-tips",
        title: "Consejos para tu Perfil",
        description: "Cómo completar un perfil atractivo y confiable",
        tips: [
            "Usa una foto clara donde se vea tu cara",
            "Escribe un nombre profesional que sea fácil de recordar",
            "Especifica tu ubicación para que te encuentren localmente",
            "Si eres profesional, incluye información sobre tu experiencia",
            "Los perfiles completos reciben 5x más solicitudes",
        ],
        examples: [
            "✓ Nombre: 'Carlos Plomería - 15 años experiencia'",
            "✓ Ubicación: 'La Plata, Buenos Aires'",
            "✗ Nombre: 'Carlos' o 'El plomero'",
        ],
    },
    {
        id: "services-tips",
        title: "Cómo Crear Servicios Atractivos",
        description: "Tips para que tus servicios destaquen",
        tips: [
            "Crea servicios específicos, no demasiado genéricos",
            "Describe exactamente qué incluye cada servicio",
            "Establece precios competitivos basados en el mercado",
            "Puedes cambiar tus servicios cuando lo necesites",
            "Los mejores servicios tienen descripciones detalladas",
        ],
        examples: [
            "✓ 'Reparación de cañerías - Diagnostico + Reparación'",
            "✗ 'Plomería en general'",
            "Precio: $5000-$10000 según complejidad",
        ],
    },
    {
        id: "verification-tips",
        title: "Proceso de Verificación",
        description: "Cómo verificar tu identidad de forma segura",
        tips: [
            "Sube ambos lados de tu DNI / Cédula de Identidad",
            "Asegúrate de que la imagen sea clara y legible",
            "El documento debe estar vigente (no vencido)",
            "La revisión toma máximo 24 horas",
            "Los datos son privados y protegidos según la ley",
            "La verificación aumenta la confianza de los clientes",
        ],
        examples: [
            "✓ Fotos nítidas sin reflejos ni sombras",
            "✓ Documento visible completamente",
            "✗ Fotos borrosas o de lado",
        ],
    },
    {
        id: "proposals-tips",
        title: "Cómo Responder Solicitudes",
        description: "Mejores prácticas para propuestas ganadores",
        tips: [
            "Responde rápido: dentro de 2 horas",
            "Lee cuidadosamente los detalles de la solicitud",
            "Sé honesto con tu presupuesto y disponibilidad",
            "Personaliza cada propuesta (evita copiar y pegar)",
            "Explica por qué eres el mejor para el trabajo",
            "Las propuestas profesionales tienen mayor aceptación",
        ],
    },
    {
        id: "ratings-tips",
        title: "Cómo Construir Reputación",
        description: "Estrategias para obtener mejores calificaciones",
        tips: [
            "Comunícate con profesionalismo siempre",
            "Llega a tiempo o avisa con anticipación",
            "Haz un trabajo de calidad excepcional",
            "Pide retroalimentación después del trabajo",
            "Responde comentarios de forma positiva",
            "Tu reputación es tu mayor activo",
        ],
    },
]

export function HelpDrawer({ trigger, topics = DEFAULT_TOPICS, defaultTopic }: HelpDrawerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(defaultTopic || topics[0]?.id)

    const current = topics.find((t) => t.id === selectedTopic)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {trigger ? (
                <>{trigger}</>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-[#6a9bcc]/30 hover:bg-[#6a9bcc]/10 hover:text-[#6a9bcc]"
                    onClick={() => setIsOpen(true)}
                    title="Ayuda"
                >
                    <HelpCircle className="h-5 w-5" style={{ color: "#6a9bcc" }} />
                </Button>
            )}

            <SheetContent side="right" className="w-full sm:w-[500px] p-0">
                <SheetHeader className="border-b border-border/40 p-6 space-y-2">
                    <SheetTitle>Centro de Ayuda</SheetTitle>
                    <SheetDescription>
                        Tips y guías para aprovechar al máximo Fixia
                    </SheetDescription>
                </SheetHeader>

                <div className="flex h-[calc(100vh-120px)]">
                    {/* Sidebar with Topics */}
                    <ScrollArea className="w-40 border-r border-border/40">
                        <div className="p-4 space-y-2">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                        selectedTopic === topic.id
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:bg-muted"
                                    }`}
                                >
                                    {topic.title}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Content Area */}
                    <ScrollArea className="flex-1">
                        {current && (
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{current.title}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {current.description}
                                    </p>
                                </div>

                                {/* Tips */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm">Consejos:</h4>
                                    <ul className="space-y-2">
                                        {current.tips.map((tip, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm">
                                                <span className="text-primary font-semibold flex-shrink-0">
                                                    •
                                                </span>
                                                <span className="text-muted-foreground">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Examples */}
                                {current.examples && (
                                    <div className="space-y-3 pt-4 border-t border-border/40">
                                        <h4 className="font-semibold text-sm">Ejemplos:</h4>
                                        <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                                            {current.examples.map((example, idx) => (
                                                <p key={idx} className="text-sm font-mono text-muted-foreground">
                                                    {example}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                                    <p className="text-xs font-semibold text-primary">
                                        💡 Recuerda:
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {current.id === "profile-tips" &&
                                            "Tu perfil es tu carta de presentación. Invierte tiempo en hacerlo completo y atractivo."}
                                        {current.id === "services-tips" &&
                                            "Servicios bien descritos atraen clientes de mejor calidad."}
                                        {current.id === "verification-tips" &&
                                            "La verificación genera confianza inmediata en los clientes."}
                                        {current.id === "proposals-tips" &&
                                            "La rapidez y personalización son clave para ganar proyectos."}
                                        {current.id === "ratings-tips" &&
                                            "Las buenas calificaciones son inversión en tu futuro profesional."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}
