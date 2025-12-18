import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-4">Planes Simples y Transparentes</h1>
                <p className="text-xl text-muted-foreground mb-6">
                    Elige el plan que mejor se adapte a tus necesidades. Sin comisiones ocultas.
                </p>
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-200 rounded-lg p-4 inline-flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-emerald-700 font-semibold">
                        ¡Oferta especial! Primer mes <span className="font-bold text-emerald-900">GRATIS</span> para todos los profesionales nuevos
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
                {/* Client Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Cliente</CardTitle>
                        <CardDescription>Para quienes buscan soluciones en el hogar</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-6">Gratis</div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-accent" />
                                <span>Publicar solicitudes ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-accent" />
                                <span>Ver perfiles de profesionales</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-accent" />
                                <span>Chat directo con profesionales</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-accent" />
                                <span>Sistema de reseñas y calificaciones</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/register?role=client" className="w-full">
                            <Button className="w-full" variant="outline">Registrarse Gratis</Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Professional Plan */}
                <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 flex gap-2 p-3">
                        <div className="bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                            1ER MES GRATIS
                        </div>
                        <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full">
                            RECOMENDADO
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Profesional</CardTitle>
                        <CardDescription>Para quienes ofrecen sus servicios</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-4xl font-bold mb-2">$3.900 <span className="text-lg font-normal text-muted-foreground">/mes</span></div>
                        <p className="text-sm text-emerald-600 font-semibold mb-3">Después del período de prueba</p>
                        <p className="text-sm text-muted-foreground mb-6">Cancela cuando quieras</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-emerald-600" />
                                <span className="font-semibold text-emerald-700">30 días gratis para probar (sin tarjeta)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Perfil profesional destacado</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Acceso ilimitado a oportunidades</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Enviar propuestas ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Verificación de identidad</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>Soporte prioritario</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/register?role=professional" className="w-full">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Crear Cuenta Gratis</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-16 text-center">
                <p className="text-muted-foreground">
                    ¿Tienes dudas sobre los pagos? Visita nuestro <Link href="/help" className="text-primary hover:underline">Centro de Ayuda</Link>.
                </p>
            </div>
        </div>
    );
}
