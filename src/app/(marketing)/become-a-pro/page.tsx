import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Shield, Clock, Search, Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProfessionalDashboardMockup } from "@/components/marketing/professional-dashboard-mockup";
import { ClientSearchMockup } from "@/components/marketing/client-search-mockup";

export default function BecomeProPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Hero Section - Split Focus */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-background bg-[radial-gradient(#d97757_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            El punto de encuentro para <span className="text-primary italic">Profesionales</span> y <span className="text-secondary italic">Clientes</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
                            Fixia conecta a expertos calificados con personas que buscan soluciones de calidad. Únete a la comunidad que está transformando los servicios en Chubut.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card for Professionals */}
                        <div className="group relative bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-7 w-7 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Soy Profesional</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        <span>Consigue más clientes sin esfuerzo</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        <span>Gestiona tu agenda y pagos</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        <span>Construye tu reputación online</span>
                                    </li>
                                </ul>
                                <Link href="/register?role=professional" className="block">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg shadow-md transition-all">
                                        Registrarme como Profesional
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Card for Clients */}
                        <div className="group relative bg-card border border-border rounded-3xl p-8 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Search className="h-7 w-7 text-secondary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Busco un Servicio</h2>
                                <ul className="space-y-3 mb-8 text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-secondary" />
                                        <span>Profesionales verificados</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-secondary" />
                                        <span>Pagos seguros y garantía</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-secondary" />
                                        <span>Atención al cliente dedicada</span>
                                    </li>
                                </ul>
                                <Link href="/register?role=client" className="block">
                                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-lg shadow-md transition-all">
                                        Contratar Profesionales
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif font-italic">+500</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Profesionales Activos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif font-italic">+2k</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Trabajos Completados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif font-italic">4.8/5</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Calificación Promedio</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif font-italic">100%</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Satisfacción Garantizada</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Info for Pros */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                                Para Profesionales
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Lleva tu negocio al <span className="text-primary italic">siguiente nivel</span></h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-sans">
                                Fixia no es solo una plataforma de búsqueda, es tu socio estratégico. Te brindamos las herramientas digitales que necesitas para profesionalizar tu servicio y escalar tus ingresos.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Trato Directo</h3>
                                        <p className="text-sm text-muted-foreground">Acuerda el precio y cobra directamente. Sin intermediarios ni comisiones ocultas.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Flexibilidad Total</h3>
                                        <p className="text-sm text-muted-foreground">Tú decides cuándo y dónde trabajar. Tu agenda, tus reglas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
                                <div className="aspect-video relative">
                                    <ProfessionalDashboardMockup />
                                </div>
                            </div>
                            {/* Floating card */}
                            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border max-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-card"></div>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold font-serif italic">+12</span>
                                </div>
                                <p className="text-sm font-medium">Nuevos clientes clientes esta semana</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Info for Clients */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6">
                                Para Clientes
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Contrata con <span className="text-secondary italic">confianza y seguridad</span></h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-sans">
                                Encontrar un profesional confiable no debería ser una odisea. En Fixia verificamos a cada experto para que tú solo te preocupes por el resultado final.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Users className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Profesionales Verificados</h3>
                                        <p className="text-muted-foreground">Revisamos antecedentes, certificaciones e identidad de cada profesional en la plataforma.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Star className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Calificaciones Reales</h3>
                                        <p className="text-muted-foreground">Lee reseñas auténticas de otros vecinos antes de contratar. La transparencia es nuestra prioridad.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link href="/register?role=client">
                                    <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md h-12 px-8">
                                        Buscar un Profesional
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border transform md:rotate-2 hover:rotate-0 transition-transform duration-500 bg-card">
                                <div className="aspect-[4/5] relative">
                                    <ClientSearchMockup />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-card border-t border-border text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">¿Listo para empezar?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register?role=professional">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                                Soy Profesional
                            </Button>
                        </Link>
                        <Link href="/register?role=client">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-muted font-semibold">
                                Soy Cliente
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
