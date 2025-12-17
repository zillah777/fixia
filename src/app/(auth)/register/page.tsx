"use client"

import { useState, Suspense, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

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
    location: z.string().min(2, {
        message: "La localidad es requerida.",
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
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "PROFESSIONAL"], {
        required_error: "Debes seleccionar un tipo de cuenta.",
    }),

    // Professional fields (optional)
    education: z.string().optional(),
    diploma: z.string().optional(),
    courses: z.string().optional(),
    professionalLicense: z.string().optional(),
    yearsExperience: z.union([z.string(), z.number()]).optional().transform(val => val === "" ? undefined : Number(val)),
    experienceDetails: z.string().optional(),
    availability: z.object({
        morning: z.boolean().optional(),
        afternoon: z.boolean().optional(),
        evening: z.boolean().optional(),
        weekend: z.boolean().optional()
    }).optional(),
    workRadius: z.enum(["Mi ciudad", "5", "10", "20", "A convenir"]).default("Mi ciudad"),
    workZones: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const defaultRole = searchParams.get("role") === "professional" ? "PROFESSIONAL" : "CLIENT"

    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // SECURITY: If user is already logged in, redirect to dashboard
    // Use useEffect to avoid returning null which breaks Radix UI Portal cleanup
    useEffect(() => {
        if (user) {
            router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')
        }
    }, [user, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            location: "",
            dni: "",
            password: "",
            confirmPassword: "",
            role: defaultRole,
            education: "",
            diploma: "",
            courses: "",
            professionalLicense: "",
            yearsExperience: undefined,
            experienceDetails: "",
            availability: {
                morning: false,
                afternoon: false,
                evening: false,
                weekend: false
            },
            workRadius: "Mi ciudad",
            workZones: "",
        },
    })

    const role = form.watch("role")


    function onInvalid(errors: any) {
        console.error("Form validation errors:", errors);
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            toast.error(`Error en ${firstErrorKey}: ${errors[firstErrorKey]?.message || "Verifica los datos"}`);
        } else {
            toast.error("Por favor revisa el formulario, hay campos inválidos.");
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Submitting values:", values);
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
            console.error("Registration error:", error);
            toast.error(error instanceof Error ? error.message : "Ocurrió un error al crear la cuenta");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center flex-col bg-muted/50 p-4">
            <Link href="/" className="flex items-center justify-center gap-2 mb-16 md:mb-24 pl-8 md:pl-0">
                <div className="relative h-24 w-auto aspect-[3/1]">
                    <Image
                        src="/logo.png"
                        alt="Fixia Logo"
                        width={270}
                        height={90}
                        className="object-contain w-48 sm:w-60 md:w-72"
                        style={{ height: "auto" }}
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
                        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Localidad</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ciudad, Provincia" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {role === "PROFESSIONAL" && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold text-sm">Información Profesional (opcional)</h3>

                                    <FormField
                                        control={form.control}
                                        name="education"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nivel Educativo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Secundario">Secundario Completo</SelectItem>
                                                        <SelectItem value="Terciario">Terciario/Técnico</SelectItem>
                                                        <SelectItem value="Universitario">Universitario</SelectItem>
                                                        <SelectItem value="Posgrado">Posgrado/Especialización</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="diploma"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificación o Diploma</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Electricista Matriculado" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="courses"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cursos Realizados</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Ej: Curso de instalaciones eléctricas industriales..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="professionalLicense"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Matrícula Profesional</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número de matrícula si aplica" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="yearsExperience"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Años de Experiencia</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Ej: 5" min="0" max="50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="experienceDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Detalle de Experiencia</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Describe tu experiencia profesional..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div>
                                        <FormLabel className="mb-3 block">Disponibilidad Horaria</FormLabel>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: "morning" as const, label: "Mañana (8-12)" },
                                                { id: "afternoon" as const, label: "Tarde (12-18)" },
                                                { id: "evening" as const, label: "Noche (18-24)" },
                                                { id: "weekend" as const, label: "Fines de semana" }
                                            ].map((time) => (
                                                <FormField
                                                    key={time.id}
                                                    control={form.control}
                                                    name={`availability.${time.id}`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center gap-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">{time.label}</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="workRadius"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Radio de Trabajo <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Mi ciudad">Solo mi ciudad</SelectItem>
                                                        <SelectItem value="5">5 km</SelectItem>
                                                        <SelectItem value="10">10 km</SelectItem>
                                                        <SelectItem value="20">20 km</SelectItem>
                                                        <SelectItem value="A convenir">A convenir (todo el país)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="workZones"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zonas de Trabajo</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Ej: Palermo, Belgrano, Recoleta..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

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
