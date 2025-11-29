"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, DollarSign } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
    price: z.coerce.number().min(1000, "El precio mínimo es $1000"),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

interface ProposalDialogProps {
    requestId: string
    requestTitle: string
    trigger?: React.ReactNode
}

export function ProposalDialog({ requestId, requestTitle, trigger }: ProposalDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messageLength, setMessageLength] = useState(0)
    const MAX_MESSAGE_LENGTH = 500

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: 0,
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log("Proposal submitted:", { requestId, ...values })
            toast.success("Propuesta enviada exitosamente")
            setOpen(false)
            form.reset()
        } catch (error) {
            toast.error("Error al enviar la propuesta")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button className="w-full">Enviar Propuesta</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enviar Propuesta</DialogTitle>
                    <DialogDescription>
                        Para: {requestTitle}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Price Field */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Presupuesto (ARS)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                            <Input
                                                type="number"
                                                placeholder="1000"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    {field.value > 0 && (
                                        <Badge variant="secondary" className="mt-2">
                                            ${Number(field.value).toLocaleString()}
                                        </Badge>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Message Field */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-2">
                                        <FormLabel className="text-sm font-medium">Mensaje</FormLabel>
                                        <span className={`text-xs ${
                                            messageLength > MAX_MESSAGE_LENGTH - 50
                                                ? "text-red-500"
                                                : messageLength > MAX_MESSAGE_LENGTH - 100
                                                ? "text-amber-500"
                                                : "text-muted-foreground"
                                        }`}>
                                            {messageLength}/{MAX_MESSAGE_LENGTH}
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe tu propuesta, disponibilidad y por qué eres el indicado..."
                                            className="min-h-[100px] resize-none"
                                            maxLength={MAX_MESSAGE_LENGTH}
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setMessageLength(e.target.value.length)
                                            }}
                                        />
                                    </FormControl>
                                    <Progress
                                        value={(messageLength / MAX_MESSAGE_LENGTH) * 100}
                                        className="mt-2 h-1.5"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading || !form.formState.isValid}
                                className="w-full"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Enviando..." : "Enviar Propuesta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
