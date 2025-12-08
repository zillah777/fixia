import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Send, MessageSquare, Star, UserCheck, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    ¿Cómo funciona Fixia?
                </h1>
                <p className="text-xl text-muted-foreground">
                    Conectamos a quienes necesitan ayuda con quienes saben cómo ayudar.
                    Simple, rápido y seguro.
                </p>
            </div>

            {/* For Clients */}
            <div className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-3xl font-bold">Para Clientes</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Search className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Publica tu Solicitud</h3>
                            <p className="text-muted-foreground">
                                Describe qué necesitas, dónde y cuándo. Es gratis y te tomará menos de 2 minutos.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <UserCheck className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Recibe Propuestas</h3>
                            <p className="text-muted-foreground">
                                Profesionales verificados verán tu solicitud y te enviarán presupuestos y mensajes.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MessageSquare className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Haz Match y Chatea</h3>
                            <p className="text-muted-foreground">
                                Acepta la propuesta que más te guste. Se habilitará el chat y podrás ver su WhatsApp.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">4</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Califica y Comenta</h3>
                            <p className="text-muted-foreground">
                                Al finalizar el trabajo, califica al profesional para ayudar a mantener la calidad de la comunidad.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <Link href="/dashboard/requests/create">
                        <Button size="lg">Publicar Solicitud Ahora</Button>
                    </Link>
                </div>
            </div>

            {/* For Professionals */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-1 bg-accent rounded-full"></div>
                    <h2 className="text-3xl font-bold">Para Profesionales</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden border-accent/10 dark:border-green-900">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle className="h-24 w-24 text-accent" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Crea tu Perfil</h3>
                            <p className="text-muted-foreground">
                                Regístrate, completa tus datos, sube tus certificaciones y define tus servicios.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-accent/10 dark:border-green-900">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Search className="h-24 w-24 text-accent" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Encuentra Oportunidades</h3>
                            <p className="text-muted-foreground">
                                Explora solicitudes de clientes en tu zona y filtra por categoría.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-accent/10 dark:border-green-900">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Send className="h-24 w-24 text-accent" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Envía Propuestas</h3>
                            <p className="text-muted-foreground">
                                Postúlate a los trabajos que te interesen con un precio y mensaje personalizado.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-accent/10 dark:border-green-900">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="h-24 w-24 text-accent" />
                        </div>
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">4</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Gana Reputación</h3>
                            <p className="text-muted-foreground">
                                Realiza un buen trabajo, recibe buenas calificaciones y consigue más clientes.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-8">
                    <Link href="/become-a-pro">
                        <Button size="lg" variant="default" className="bg-accent hover:bg-accent">Comenzar como Profesional</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
