"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User, Briefcase, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
import { PasswordInput } from "@/components/ui/password-input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DatePickerSelect } from "@/components/ui/date-picker-select"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor ingresa un email válido.",
    }),
    phone: z.string().min(10, {
        message: "Ingresa un número de teléfono válido.",
    }),
    dni: z.string().min(7, {
        message: "El DNI debe tener al menos 7 dígitos.",
    }).max(9, {
        message: "El DNI no puede tener más de 9 dígitos.",
    }).regex(/^\d+$/, {
        message: "El DNI solo debe contener números.",
    }),
    birthdate: z.date({
        required_error: "La fecha de nacimiento es obligatoria.",
    }).refine((date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18;
    }, {
        message: "Debes ser mayor de 18 años para registrarte.",
    }),
    password: z.string().min(6, {
        message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    role: z.enum(["CLIENT", "PROFESSIONAL"], {
        required_error: "Debes seleccionar un tipo de cuenta.",
    }),
})

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultRole = searchParams.get("role") === "professional" ? "PROFESSIONAL" : "CLIENT"

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            dni: "",
            password: "",
            role: defaultRole,
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al registrarse");
            }

            toast.success("Cuenta creada exitosamente. Por favor verifica tu email.");

            if (values.role === "PROFESSIONAL") {
                // For professionals, we might want to redirect to a specific onboarding or payment page first
                // But for now, let's send them to verify email page
                router.push("/auth/verify-email");
            } else {
                router.push("/auth/verify-email");
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Ocurrió un error al crear la cuenta");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center flex-col bg-muted/50 p-4">
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                <div className="relative h-12 sm:h-14 md:h-16 w-auto aspect-[3/1]">
                    <Image
                        src="/logo.svg"
                        alt="Fixia Logo"
                        width={180}
                        height={60}
                        className="object-contain"
                        style={{ width: "auto", height: "auto" }}
                        priority
                    />
                </div>
            </Link>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Únete a Fixia para encontrar o brindar servicios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>¿Cómo quieres usar Fixia?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="grid grid-cols-2 gap-4"
                                            >
                                                <div>
                                                    <RadioGroupItem value="CLIENT" id="client" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="client"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                                    >
                                                        <User className="mb-3 h-6 w-6" />
                                                        Cliente
                                                    </Label>
                                                </div>
                                                <div>
                                                    <RadioGroupItem value="PROFESSIONAL" id="professional" className="peer sr-only" />
                                                    <Label
                                                        htmlFor="professional"
                                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                                    >
                                                        <Briefcase className="mb-3 h-6 w-6" />
                                                        Profesional
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan Pérez" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="dni"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DNI</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12345678" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="birthdate"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: es })
                                                        ) : (
                                                            <span>Fecha de nacimiento</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    captionLayout="dropdown-buttons"
                                                    fromYear={1900}
                                                    toYear={new Date().getFullYear()}
                                                    classNames={{
                                                        caption_dropdowns: "flex justify-center gap-1",
                                                        dropdown_month: "flex [&>span]:hidden",
                                                        dropdown_year: "flex [&>span]:hidden",
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>

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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+54 9 11 ..." {...field} />
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
                                            <PasswordInput placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Registrando..." : "Registrarse"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-muted-foreground text-center w-full">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    )
}
