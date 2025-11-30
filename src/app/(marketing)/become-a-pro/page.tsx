import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Shield, Clock, Search, Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BecomeProPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Split Focus */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                            El punto de encuentro para <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Profesionales</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Clientes</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Fixia conecta a expertos calificados con personas que buscan soluciones de calidad. Únete a la comunidad que está transformando los servicios en Chubut.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card for Professionals */}
                        <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-7 w-7 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Soy Profesional</h2>
                                <ul className="space-y-3 mb-8 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Consigue más clientes sin esfuerzo</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Gestiona tu agenda y pagos</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Construye tu reputación online</span>
                                    </li>
                                </ul>
                                <Link href="/register?role=professional" className="block">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-lg shadow-green-900/20">
                                        Registrarme como Profesional
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Card for Clients */}
                        <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Search className="h-7 w-7 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Busco un Servicio</h2>
                                <ul className="space-y-3 mb-8 text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-500" />
                                        <span>Profesionales verificados</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-500" />
                                        <span>Pagos seguros y garantía</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-500" />
                                        <span>Atención al cliente dedicada</span>
                                    </li>
                                </ul>
                                <Link href="/register?role=client" className="block">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg shadow-lg shadow-blue-900/20">
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
            <section className="py-12 border-y bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">+500</div>
                            <div className="text-sm text-muted-foreground">Profesionales Activos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">+2k</div>
                            <div className="text-sm text-muted-foreground">Trabajos Completados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">4.8/5</div>
                            <div className="text-sm text-muted-foreground">Calificación Promedio</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">100%</div>
                            <div className="text-sm text-muted-foreground">Satisfacción Garantizada</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Info for Pros */}
            <section className="py-20 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-sm mb-6">
                                Para Profesionales
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Lleva tu negocio al siguiente nivel</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Fixia no es solo una plataforma de búsqueda, es tu socio estratégico. Te brindamos las herramientas digitales que necesitas para profesionalizar tu servicio y escalar tus ingresos.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Pagos Garantizados</h3>
                                        <p className="text-sm text-muted-foreground">Olvídate de cobrar. Nosotros gestionamos los pagos de forma segura.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Flexibilidad Total</h3>
                                        <p className="text-sm text-muted-foreground">Tú decides cuándo y dónde trabajar. Tu agenda, tus reglas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                                    <Image
                                        src="/images/marketing/professional-dashboard-mockup-light.svg"
                                        alt="Dashboard de Profesional"
                                        fill
                                        className="object-cover dark:hidden"
                                    />
                                    <Image
                                        src="/images/marketing/professional-dashboard-mockup-dark.svg"
                                        alt="Dashboard de Profesional"
                                        fill
                                        className="object-cover hidden dark:block"
                                    />
                                </div>
                            </div>
                            {/* Floating card */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900"></div>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold">+12</span>
                                </div>
                                <p className="text-sm font-medium">Nuevos clientes esta semana</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Info for Clients */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="flex-1">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium text-sm mb-6">
                                Para Clientes
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contrata con confianza y seguridad</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Encontrar un profesional confiable no debería ser una odisea. En Fixia verificamos a cada experto para que tú solo te preocupes por el resultado final.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Profesionales Verificados</h3>
                                        <p className="text-muted-foreground">Revisamos antecedentes, certificaciones e identidad de cada profesional en la plataforma.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Calificaciones Reales</h3>
                                        <p className="text-muted-foreground">Lee reseñas auténticas de otros vecinos antes de contratar. La transparencia es nuestra prioridad.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link href="/register?role=client">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Buscar un Profesional
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-[4/5] bg-white dark:bg-slate-800 relative">
                                    <Image
                                        src="/images/marketing/client-search-mockup-light.svg"
                                        alt="Búsqueda de Servicios"
                                        fill
                                        className="object-cover dark:hidden"
                                    />
                                    <Image
                                        src="/images/marketing/client-search-mockup-dark.svg"
                                        alt="Búsqueda de Servicios"
                                        fill
                                        className="object-cover hidden dark:block"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">¿Listo para empezar?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register?role=professional">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                                Soy Profesional
                            </Button>
                        </Link>
                        <Link href="/register?role=client">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-slate-600 hover:bg-slate-800 text-white hover:text-white">
                                Soy Cliente
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
