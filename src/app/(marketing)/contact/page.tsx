"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    lastname: formData.get("lastname"),
                    email: formData.get("email"),
                    subject: formData.get("subject"),
                    message: formData.get("message")
                })
            });

            if (response.ok) {
                toast.success("Mensaje enviado. Nos pondremos en contacto pronto.");
                e.currentTarget.reset();
            } else {
                toast.error("Error al enviar el mensaje. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Error al enviar el mensaje. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
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
                                        <p className="text-muted-foreground">+54 9 2804874166</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Oficina</p>
                                        <p className="text-muted-foreground">Playa Union, Chubut, Argentina</p>
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
                                        <Input id="name" name="name" placeholder="Tu nombre" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastname" className="text-sm font-medium">Apellido</label>
                                        <Input id="lastname" name="lastname" placeholder="Tu apellido" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                                    <Input id="subject" name="subject" placeholder="¿En qué podemos ayudarte?" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                                    <Textarea id="message" name="message" placeholder="Escribe tu mensaje aquí..." className="min-h-[120px]" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar Mensaje"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
