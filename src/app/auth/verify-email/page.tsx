import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Verifica tu correo electrónico</CardTitle>
                    <CardDescription>
                        Hemos enviado un enlace de verificación a tu dirección de email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        ¿No recibiste el email?
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full">Reenviar email</Button>
                    <Link href="/login" className="w-full">
                        <Button variant="link" className="w-full">Volver al inicio de sesión</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
