import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Revolucionando los servicios del hogar
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    En Fixia, nuestra misión es conectar a personas con los mejores profesionales locales de manera rápida, segura y confiable.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/register">
                        <Button size="lg">Únete a Fixia</Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" size="lg">Contáctanos</Button>
                    </Link>
                </div>
            </div>

            {/* Values Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-card p-8 rounded-xl border shadow-sm">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Confianza</h3>
                    <p className="text-muted-foreground">
                        Verificamos a cada profesional para asegurar que recibas un servicio de calidad y seguridad en tu hogar.
                    </p>
                </div>
                <div className="bg-card p-8 rounded-xl border shadow-sm">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Transparencia</h3>
                    <p className="text-muted-foreground">
                        Sin costos ocultos. Conoce los precios y lee reseñas reales antes de contratar.
                    </p>
                </div>
                <div className="bg-card p-8 rounded-xl border shadow-sm">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Innovación</h3>
                    <p className="text-muted-foreground">
                        Utilizamos tecnología moderna para hacer que la contratación de servicios sea tan fácil como pedir un viaje.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                        Fixia nació en 2025 con una idea simple: encontrar un plomero o electricista de confianza no debería ser una odisea.
                        Lo que comenzó como un pequeño directorio local se ha convertido en la plataforma líder de servicios bajo demanda,
                        ayudando a miles de profesionales a crecer sus negocios y a clientes a resolver sus problemas domésticos.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Hoy, seguimos comprometidos con nuestra visión de digitalizar y profesionalizar el sector de servicios,
                        creando oportunidades económicas y mejorando la calidad de vida de nuestra comunidad.
                    </p>
                </div>
            </div>
        </div>
    );
}
