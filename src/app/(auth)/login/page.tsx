"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor ingresa un email válido.",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const { refreshUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al iniciar sesión");
            }

            // Force update of user context before redirecting
            await refreshUser();

            toast.success("¡Bienvenido de nuevo!");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Credenciales inválidas");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-start justify-center bg-muted/50 p-4 pt-32">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2">
                    <div className="relative h-12 w-auto aspect-[3/1]">
                        <Image
                            src="/logo.png"
                            alt="Fixia Logo"
                            width={120}
                            height={40}
                            className="object-contain"
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                    </div>
                </Link>


                <Card className="w-full max-w-md">

                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                        <CardDescription>
                            Ingresa tu email y contraseña para acceder a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="nombre@ejemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <span className="sr-only">
                                                            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Ingresar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="text-sm text-muted-foreground text-center">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Regístrate
                            </Link>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                            <Link href="/forgot-password" className="hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
