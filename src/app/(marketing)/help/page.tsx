import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, FileText, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
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

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border rounded-xl text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">Guías Básicas</h3>
                </div>
                <div className="p-6 border rounded-xl text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">Pagos y Facturación</h3>
                </div>
                <div className="p-6 border rounded-xl text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">Seguridad y Cuenta</h3>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>¿Cómo funciona el pago a los profesionales?</AccordionTrigger>
                            <AccordionContent>
                                El pago por el servicio se acuerda directamente entre el Cliente y el Profesional.
                                Fixia no interviene en la transacción del servicio final, solo cobramos una suscripción mensual a los profesionales por el uso de la plataforma.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>¿Es gratis para los clientes?</AccordionTrigger>
                            <AccordionContent>
                                ¡Sí! Para los clientes, publicar solicitudes y contactar profesionales es 100% gratuito.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>¿Cómo verifican a los profesionales?</AccordionTrigger>
                            <AccordionContent>
                                Solicitamos documentación oficial y certificaciones a nuestros profesionales.
                                Aquellos que completan el proceso reciben una insignia de "Verificado" en su perfil.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>¿Qué hago si tengo un problema con un servicio?</AccordionTrigger>
                            <AccordionContent>
                                Te recomendamos primero intentar resolverlo con el profesional.
                                Si no es posible, puedes contactar a nuestro soporte para mediar en la situación.
                                Recuerda siempre calificar y dejar una reseña para alertar a otros usuarios.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>¿Cómo cancelo mi suscripción profesional?</AccordionTrigger>
                            <AccordionContent>
                                Puedes cancelar tu suscripción en cualquier momento desde tu Panel de Control &gt; Perfil &gt; Suscripción.
                                Seguirás teniendo acceso hasta el final del periodo facturado.
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
