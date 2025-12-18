"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams ? searchParams.get("token") : null;
    const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">("pending");
    const [email, setEmail] = useState("");
    const [isResending, setIsResending] = useState(false);

    const verifyToken = React.useCallback(async () => {
        setStatus("verifying");
        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            if (res.ok) {
                setStatus("success");
                toast.success("Email verificado correctamente");
            } else {
                setStatus("error");
                toast.error("Token expirado o inválido");
            }
        } catch (error) {
            setStatus("error");
            toast.error("Error al verificar email");
            console.error("Verification error:", error);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, [token, verifyToken]);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Por favor ingresa tu email");
            return;
        }

        setIsResending(true);
        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            toast.success(data.message || "Email reenviado correctamente");
        } catch (error) {
            toast.error("Error al reenviar email");
            console.error("Resend error:", error);
        } finally {
            setIsResending(false);
        }
    };

    if (status === "verifying") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl">Verificando...</CardTitle>
                        <CardDescription>
                            Estamos verificando tu email. Por favor espera.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-accent" />
                        </div>
                        <CardTitle className="text-2xl">¡Email verificado!</CardTitle>
                        <CardDescription>
                            Tu cuenta está lista para usar. Ahora puedes iniciar sesión.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/login" className="w-full">
                            <Button className="w-full">Ir a inicio de sesión</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Verificación fallida</CardTitle>
                        <CardDescription>
                            El token de verificación es inválido o ha expirado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Ingresa tu email para recibir un nuevo enlace de verificación.
                        </p>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm mb-4"
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full"
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Reenviar email"
                            )}
                        </Button>
                        <Link href="/login" className="w-full">
                            <Button variant="link" className="w-full">Volver al inicio de sesión</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-secondary" />
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
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <Button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        variant="outline"
                        className="w-full"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Reenviar email"
                        )}
                    </Button>
                    <Link href="/login" className="w-full">
                        <Button variant="link" className="w-full">Volver al inicio de sesión</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl">Cargando...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
