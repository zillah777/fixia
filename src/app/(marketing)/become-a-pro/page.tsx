import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Shield, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BecomeProPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 z-0"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                Haz crecer tu negocio con Fixia
                            </h1>
                            <p className="text-xl text-slate-300 mb-8">
                                Únete a la red de profesionales más grande. Encuentra nuevos clientes, gestiona tu agenda y aumenta tus ingresos.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register?role=professional">
                                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-green-600 hover:bg-green-700 border-none">
                                        Registrarme como Profesional
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-4 text-sm text-slate-400">
                                Prueba gratuita de 7 días. Sin compromiso.
                            </p>
                        </div>
                        <div className="hidden lg:block relative h-[500px] w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                            {/* Placeholder for a hero image showing a happy professional */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                [Imagen Hero Profesional]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir Fixia?</h2>
                        <p className="text-xl text-muted-foreground">
                            Te damos las herramientas para que te enfoques en lo que mejor sabes hacer.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Más Clientes</h3>
                            <p className="text-muted-foreground">
                                Accede a cientos de solicitudes diarias en tu zona. Tú decides a cuáles postularte.
                            </p>
                        </div>
                        <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Seguridad Garantizada</h3>
                            <p className="text-muted-foreground">
                                Trabaja con clientes verificados. Sistema de reputación transparente para todos.
                            </p>
                        </div>
                        <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Tu Tiempo, Tus Reglas</h3>
                            <p className="text-muted-foreground">
                                Gestiona tu disponibilidad con nuestra agenda inteligente. Trabaja cuando quieras.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            {/* Placeholder for app screenshot */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl h-[400px] flex items-center justify-center border">
                                [Captura de la App para Pros]
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold mb-8">Es muy fácil comenzar</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Regístrate</h3>
                                        <p className="text-muted-foreground">Crea tu cuenta y completa tu perfil profesional con tus datos y experiencia.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Verifícate</h3>
                                        <p className="text-muted-foreground">Subimos tus certificaciones y validamos tu identidad para darte el sello de "Verificado".</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Empieza a trabajar</h3>
                                        <p className="text-muted-foreground">Explora oportunidades, envía propuestas y consigue tus primeros trabajos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para impulsar tu carrera?</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Únete a miles de profesionales que ya confían en Fixia para gestionar su negocio.
                    </p>
                    <Link href="/register?role=professional">
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                            Crear Cuenta Profesional
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
