"use client"

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, FileText, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Centro de Ayuda</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    ¿En qué podemos ayudarte hoy?
                </p>
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Buscar en la ayuda..." className="pl-10 h-12" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div
                    onClick={() => scrollToSection('guias-basicas')}
                    className="p-6 border rounded-xl text-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                    <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">Guías Básicas</h3>
                </div>
                <div
                    onClick={() => scrollToSection('seguridad-cuenta')}
                    className="p-6 border rounded-xl text-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                    <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">Seguridad y Cuenta</h3>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
                    {/* Guías Básicas Section */}
                    <h3 id="guias-basicas" className="text-xl font-bold mb-4 text-primary scroll-mt-8">Guías Básicas</h3>
                    <Accordion type="single" collapsible className="w-full mb-12">
                        <AccordionItem value="basic-1">
                            <AccordionTrigger>¿Cómo me registro en Fixia?</AccordionTrigger>
                            <AccordionContent>
                                Ir a la página de inicio, hacer clic en &quot;Iniciar Sesión&quot; o &quot;Registrarme&quot;, completar tu información personal y verificar tu correo electrónico. ¡Listo! Ya puedes comenzar a buscar profesionales o publicar solicitudes.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="basic-2">
                            <AccordionTrigger>¿Cómo publico una solicitud de servicio?</AccordionTrigger>
                            <AccordionContent>
                                Una vez registrado, ve a &quot;Crear Solicitud&quot;, selecciona el tipo de servicio, describe lo que necesitas, especifica tu ubicación y presupuesto. Los profesionales cercanos verán tu solicitud y podrán enviar propuestas.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="basic-3">
                            <AccordionTrigger>¿Es gratis usar Fixia?</AccordionTrigger>
                            <AccordionContent>
                                ¡Sí! Para los clientes, publicar solicitudes y contactar con profesionales es completamente gratuito. Solo los profesionales que deseen una suscripción premium pagan por el acceso a características avanzadas.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="basic-4">
                            <AccordionTrigger>¿Cómo elijo el profesional adecuado?</AccordionTrigger>
                            <AccordionContent>
                                Revisa las propuestas que recibas, compara calificaciones, reseñas, experiencia y precios. Puedes chatear con los profesionales antes de contratar para resolver dudas. Elige el que mejor se adapte a tus necesidades y presupuesto.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="basic-5">
                            <AccordionTrigger>¿Cómo funciona el pago?</AccordionTrigger>
                            <AccordionContent>
                                El pago se acuerda directamente entre tú y el profesional. Puedes negociar y acordar las condiciones de pago que prefieras (transferencia, efectivo, etc.). Fixia no interviene en la transacción.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Seguridad y Cuenta Section */}
                    <h3 id="seguridad-cuenta" className="text-xl font-bold mb-4 text-primary scroll-mt-8">Seguridad y Cuenta</h3>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="security-1">
                            <AccordionTrigger>¿Cómo protegen mi información personal?</AccordionTrigger>
                            <AccordionContent>
                                Utilizamos encriptación SSL de grado empresarial para proteger tus datos. Tu información personal solo se comparte con profesionales cuando contactas con ellos. Nunca vendemos ni compartimos tus datos con terceros sin tu consentimiento.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="security-2">
                            <AccordionTrigger>¿Cómo puedo verificar que un profesional es auténtico?</AccordionTrigger>
                            <AccordionContent>
                                Los profesionales verificados tienen una insignia de &quot;Verificado&quot; en su perfil. Esto significa que hemos validado su identidad, documentación y certificaciones profesionales. También puedes revisar sus calificaciones y reseñas de otros clientes.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="security-3">
                            <AccordionTrigger>¿Puedo cambiar mi contraseña?</AccordionTrigger>
                            <AccordionContent>
                                Sí. Ve a tu Perfil &gt; Configuración &gt; Seguridad &gt; Cambiar Contraseña. Ingresa tu contraseña actual y la nueva contraseña. Recomendamos usar contraseñas fuertes y cambiarlas regularmente.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="security-4">
                            <AccordionTrigger>¿Qué hago si mi cuenta fue hackeada?</AccordionTrigger>
                            <AccordionContent>
                                Contacta inmediatamente a nuestro equipo de soporte en support@fixia.app. Cambiaremos tu contraseña de forma segura, revisaremos cualquier actividad sospechosa y te ayudaremos a recuperar el control de tu cuenta.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="security-5">
                            <AccordionTrigger>¿Puedo eliminar mi cuenta?</AccordionTrigger>
                            <AccordionContent>
                                Sí. Ve a tu Perfil &gt; Configuración &gt; Cuenta &gt; Eliminar Cuenta. Se te pedirá que confirmes. Una vez eliminada, todos tus datos serán borrados de nuestros servidores según nuestras políticas de privacidad.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            <div className="mt-16 bg-muted/50 p-8 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">¿No encontraste lo que buscabas?</h3>
                <p className="text-muted-foreground mb-6">Nuestro equipo de soporte está listo para ayudarte.</p>
                <Link href="/contact">
                    <Button>Contactar Soporte</Button>
                </Link>
            </div>
        </div>
    );
}
