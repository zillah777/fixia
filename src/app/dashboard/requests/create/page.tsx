"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, MapPin, Calendar as CalendarIcon, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { TagInput } from "@/components/ui/tag-input"
import { DatePickerSelect } from "@/components/ui/date-picker-select"

const formSchema = z.object({
    title: z.string().min(5, {
        message: "El título debe tener al menos 5 caracteres.",
    }),
    category: z.string({
        required_error: "Por favor selecciona una categoría.",
    }),
    description: z.string().min(20, {
        message: "La descripción debe ser más detallada (mínimo 20 caracteres).",
    }),
    location: z.string().min(5, {
        message: "Ingresa una dirección válida.",
    }),
    budget: z.array(z.number()).refine((val) => val[0] > 0, {
        message: "El presupuesto debe ser mayor a 0.",
    }),
    date: z.date({
        required_error: "Selecciona una fecha preferida.",
    }),
    tags: z.array(z.string()).max(5, {
        message: "Máximo 5 tags permitidos.",
    }).optional(),
})

export default function CreateRequestPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            budget: [5000], // Default budget
            tags: [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log(values)
            toast.success("Solicitud publicada exitosamente")
            router.push("/dashboard/requests")
        } catch (error) {
            toast.error("Error al publicar solicitud", {
                description: "Hubo un problema al crear tu solicitud. Intenta nuevamente."
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Nueva Solicitud</h2>
                <p className="text-muted-foreground">Describe lo que necesitas y recibe propuestas de profesionales.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Servicio</CardTitle>
                    <CardDescription>
                        Completa el formulario con la mayor precisión posible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título de la Solicitud</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Reparación de fuga en baño" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Un título breve y claro de lo que necesitas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una categoría" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="plomeria">Plomería</SelectItem>
                                                    <SelectItem value="electricidad">Electricidad</SelectItem>
                                                    <SelectItem value="gasista">Gasista</SelectItem>
                                                    <SelectItem value="albañileria">Albañilería</SelectItem>
                                                    <SelectItem value="pintura">Pintura</SelectItem>
                                                    <SelectItem value="aire-acondicionado">Aire Acondicionado</SelectItem>
                                                    <SelectItem value="fletes">Fletes y Mudanzas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ubicación</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="Dirección o Barrio" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción Detallada</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe el problema, materiales necesarios, horarios disponibles, etc."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags / Palabras Clave (Opcional)</FormLabel>
                                        <FormControl>
                                            <TagInput
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="Ej. Urgente, Materiales incluidos..."
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Agrega palabras clave para ayudar a los profesionales a encontrar tu solicitud.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Fecha Preferida</FormLabel>
                                            <DatePickerSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                minYear={new Date().getFullYear()}
                                                maxYear={new Date().getFullYear() + 1}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Presupuesto Estimado (ARS)</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4 pt-2">
                                                    <Slider
                                                        min={1000}
                                                        max={500000}
                                                        step={1000}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    />
                                                    <div className="flex items-center justify-between border rounded-md p-2 bg-muted/50">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-mono font-medium text-lg">
                                                            ${field.value?.[0]?.toLocaleString() || '0'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Este valor es orientativo para los profesionales.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Publicar Solicitud
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
