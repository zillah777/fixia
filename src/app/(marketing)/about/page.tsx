import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Users, Target, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden bg-primary/5">
                <div className="container px-4 mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Más que servicios, construimos confianza
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                        En Fixia, transformamos la manera en que encuentras profesionales de confianza, creando una comunidad segura, transparente y eficiente.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 text-lg rounded-full">Únete a la Comunidad</Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full bg-background/50 backdrop-blur-sm">Contáctanos</Button>
                        </Link>
                    </div>
                </div>
                {/* Abstract shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-background">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                                <Target className="h-4 w-4" /> Nuestra Misión
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simplificar tu vida con soluciones expertas</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Creemos que encontrar profesionales de confianza no debería ser un dolor de cabeza. Nuestra plataforma utiliza tecnología avanzada para verificar a cada profesional, asegurar presupuestos justos y garantizar la satisfacción en cada trabajo.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    "Verificación rigurosa de identidad y antecedentes.",
                                    "Comunicación directa entre clientes y profesionales.",
                                    "Garantía de satisfacción en todos los servicios."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-muted rotate-3 hover:rotate-0 transition-all duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=1000&auto=format&fit=crop"
                                    alt="Professional working"
                                    width={800}
                                    height={800}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Lo que nos define</h2>
                        <p className="text-muted-foreground">Nuestros valores fundamentales guían cada decisión que tomamos para servirte mejor.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <CardContent className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Seguridad Primero</h3>
                                <p className="text-muted-foreground">Tu seguridad es nuestra prioridad. Implementamos los estándares más altos de verificación.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <CardContent className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Comunidad</h3>
                                <p className="text-muted-foreground">Fomentamos relaciones duraderas basadas en el respeto mutuo entre clientes y profesionales.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <CardContent className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold">Pasión por Servir</h3>
                                <p className="text-muted-foreground">Nos apasiona resolver problemas y mejorar la calidad de vida de nuestros usuarios día a día.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-background border-t">
                <div className="container px-4 mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para encontrar al profesional ideal?</h2>
                    <p className="text-xl text-muted-foreground mb-10">Únete a miles de usuarios que ya confían en Fixia para sus proyectos.</p>
                    <Link href="/services">
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all group">
                            Explorar Servicios <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
