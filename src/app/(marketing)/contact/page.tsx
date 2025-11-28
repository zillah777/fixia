"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Mensaje enviado. Nos pondremos en contacto pronto.");
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
                    <p className="text-xl text-muted-foreground">
                        Estamos aquí para ayudarte. Envíanos tus dudas o sugerencias.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
                                <CardDescription>
                                    Medios oficiales para comunicarte con el equipo de Fixia.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">soporte@fixia.app</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Teléfono</p>
                                        <p className="text-muted-foreground">+54 11 1234-5678</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Oficina</p>
                                        <p className="text-muted-foreground">Av. Corrientes 1234, CABA, Argentina</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-muted/50 p-6 rounded-xl border">
                            <h3 className="font-semibold mb-2">Horario de Atención</h3>
                            <p className="text-muted-foreground">
                                Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                                Sábados: 10:00 AM - 2:00 PM
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>
                                Completa el formulario y te responderemos a la brevedad.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                                        <Input id="name" placeholder="Tu nombre" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastname" className="text-sm font-medium">Apellido</label>
                                        <Input id="lastname" placeholder="Tu apellido" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                                    <Input id="subject" placeholder="¿En qué podemos ayudarte?" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                                    <Textarea id="message" placeholder="Escribe tu mensaje aquí..." className="min-h-[120px]" required />
                                </div>
                                <Button type="submit" className="w-full">Enviar Mensaje</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
