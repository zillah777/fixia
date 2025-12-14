"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Shield, Clock, Search, Star, Users, ArrowRight, Sparkles, Zap, DollarSign } from "lucide-react";
import Link from "next/link";
import { ProfessionalDashboardMockup } from "@/components/marketing/professional-dashboard-mockup";
import { ClientSearchMockup } from "@/components/marketing/client-search-mockup";
import { motion } from "framer-motion";

export default function BecomeProPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF8] dark:bg-background text-stone-900 dark:text-foreground font-sans selection:bg-primary/20 dark:selection:bg-primary/30">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mb-6">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-stone-700 dark:text-stone-300 uppercase tracking-wide">La plataforma de servicios de Chubut</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-stone-900 dark:text-white leading-[1.1]">
                            Conectamos <span className="text-primary font-serif italic">Talento</span> con <span className="text-accent font-serif italic">Necesidades</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            Fixia es el ecosistema donde profesionales calificados y clientes exigentes se encuentran. Sin intermediarios, sin complicaciones.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Card for Professionals */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="group relative bg-white dark:bg-card border border-stone-200 dark:border-stone-800 rounded-3xl p-8 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="h-12 w-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-stone-900 dark:text-white">Soy Profesional</h2>
                                <p className="text-stone-600 dark:text-stone-400 mb-8 font-medium">Digitaliza tu oficio y accede a nuevos clientes.</p>

                                <ul className="space-y-4 mb-8 text-stone-700 dark:text-stone-300 flex-1">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Consigue trabajos en tu zona sin esfuerzo</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Gestiona tu reputación digital</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>0% Comisión por trabajo realizado</span>
                                    </li>
                                </ul>

                                <Link href="/register?role=professional" className="block mt-auto">
                                    <Button className="w-full bg-stone-900 hover:bg-primary text-white h-12 text-base rounded-xl shadow-lg shadow-stone-900/10 transition-all">
                                        Registrarme como Profesional
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Card for Clients */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="group relative bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 hover:border-accent/30 dark:hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 dark:hover:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="h-12 w-12 bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Search className="h-6 w-6 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-stone-900 dark:text-white">Busco un Servicio</h2>
                                <p className="text-stone-600 dark:text-stone-400 mb-8 font-medium">Encuentra al experto ideal para tu proyecto.</p>

                                <ul className="space-y-4 mb-8 text-stone-700 dark:text-stone-300 flex-1">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                        <span>Perfiles verificados y reseñas reales</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                        <span>Trato directo, sin intermediarios</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                        <span>Soporte dedicado ante cualquier duda</span>
                                    </li>
                                </ul>

                                <Link href="/register?role=client" className="block mt-auto">
                                    <Button variant="outline" className="w-full bg-white hover:bg-accent/10 hover:text-accent hover:border-accent/30 text-stone-900 border-stone-200 h-12 text-base rounded-xl shadow-sm transition-all">
                                        Contratar Profesionales
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-stone-200 dark:border-stone-800 bg-white dark:bg-card">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "+500", label: "Profesionales Activos", color: "text-primary" },
                            { value: "+2k", label: "Trabajos Completados", color: "text-stone-900 dark:text-white" },
                            { value: "4.8/5", label: "Calificación Promedio", color: "text-yellow-500 dark:text-yellow-400" },
                            { value: "100%", label: "Satisfacción Garantizada", color: "text-accent" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className={`text-3xl md:text-4xl font-bold mb-2 font-serif italic transition-colors ${stat.color}`}>{stat.value}</div>
                                <div className="text-xs text-stone-500 font-bold uppercase tracking-widest group-hover:text-stone-800 dark:group-hover:text-stone-300 transition-colors">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Info for Pros */}
            <section className="py-24 bg-[#FFFBF8] dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 items-center mb-20">
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-medium text-xs uppercase tracking-wider mb-6">
                                Para Profesionales
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-stone-900 dark:text-white">
                                Tu oficio, <br />
                                <span className="font-serif italic text-primary">potenciado.</span>
                            </h2>
                            <p className="text-lg text-stone-700 dark:text-stone-300 mb-10 leading-relaxed max-w-lg">
                                Fixia te brinda las herramientas digitales para profesionalizar tu servicio, organizar tu agenda y multiplicar tus ingresos.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-stone-800 border border-primary/20 dark:border-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-primary/50 transition-colors">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900 dark:text-white group-hover:text-primary transition-colors">Libertad Económica</h3>
                                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">Tú defines tus precios. El cliente te paga directamente a ti. Nosotros solo hacemos la conexión.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-stone-800 border border-primary/20 dark:border-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-primary/50 transition-colors">
                                        <Zap className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900 dark:text-white group-hover:text-primary transition-colors">Visibilidad Instantánea</h3>
                                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">Tu perfil aparece destacado cuando los clientes buscan tus servicios en tu zona.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 dark:shadow-none border border-stone-200 dark:border-stone-800 bg-white dark:bg-card">
                                <div className="aspect-[4/3] relative">
                                    <ProfessionalDashboardMockup />
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -z-10 top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Info for Clients */}
            <section className="py-24 bg-[#F8FBF9] dark:bg-card border-t border-stone-100 dark:border-stone-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent font-medium text-xs uppercase tracking-wider mb-6">
                                Para Clientes
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-stone-900 dark:text-white">
                                Contrata con <br />
                                <span className="font-serif italic text-accent">tranquilidad.</span>
                            </h2>
                            <p className="text-lg text-stone-700 dark:text-stone-300 mb-10 leading-relaxed max-w-lg">
                                Olvídate de la incertidumbre. En Fixia, la transparencia es la norma. Perfiles completos, fotos reales y opiniones de tus vecinos.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-stone-900 border border-accent/20 dark:border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 transition-colors">
                                        <Shield className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900 dark:text-white group-hover:text-accent transition-colors">Seguridad Primero</h3>
                                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">Verificamos la identidad de cada profesional para que abras la puerta de tu hogar con confianza.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-stone-900 border border-accent/20 dark:border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:border-accent/50 transition-colors">
                                        <Star className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-stone-900 dark:text-white group-hover:text-accent transition-colors">Meritocracia Real</h3>
                                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">Las calificaciones no se pueden comprar. Solo los clientes reales pueden dejar reseñas.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <Link href="/register?role=client">
                                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-stone-300 text-stone-900 hover:bg-accent/10 hover:text-accent hover:border-accent/30 text-base font-medium shadow-sm transition-all">
                                        Buscar un Profesional
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-accent/10 dark:shadow-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-[4/5] relative">
                                    <ClientSearchMockup />
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -z-10 top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
                            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-[#FDFCF8] dark:bg-background border-t border-stone-200 dark:border-stone-800 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-stone-900 dark:text-white">¿Listo para empezar?</h2>
                    <p className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto font-medium">Únete a la comunidad que está redefiniendo los servicios en Chubut.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/register?role=professional">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-stone-900 hover:bg-primary text-white text-lg shadow-xl shadow-stone-900/20 transition-all hover:scale-105">
                                Soy Profesional
                            </Button>
                        </Link>
                        <Link href="/register?role=client">
                            <Button size="lg" variant="ghost" className="w-full sm:w-auto h-14 px-10 rounded-full text-stone-600 hover:text-accent hover:bg-accent/10 text-lg">
                                Soy Cliente
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
