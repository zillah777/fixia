"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [status, setStatus] = useState<"loading" | "processing" | "success">("loading")

    useEffect(() => {
        // Simulate loading MercadoPago interface
        const timer = setTimeout(() => {
            setStatus("processing")
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    const handlePayment = async () => {
        setStatus("loading")
        try {
            // Create checkout preference and get MercadoPago URL
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: "professional" })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al procesar el pago");
            }

            const data = await response.json();

            // Redirect to MercadoPago for payment
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No payment URL received");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error instanceof Error ? error.message : "Error al procesar el pago");
            setStatus("processing");
        }
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-none shadow-xl text-center overflow-hidden">
                    <div className="bg-accent h-2 w-full" />
                    <CardContent className="pt-12 pb-12 px-8">
                        <div className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Confirmado!</h2>
                        <p className="text-gray-500 mb-8">
                            Tu suscripción está activa. Ahora tienes acceso ilimitado a todas las funcionalidades PRO.
                        </p>
                        <Button className="w-full rounded-xl" onClick={() => router.push("/dashboard")}>
                            Ir al Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
            <Card className="w-full max-w-md border-none shadow-xl overflow-hidden">
                <div className="bg-[#009EE3] p-6 text-white text-center">
                    <h2 className="text-xl font-bold">Mercado Pago</h2>
                </div>

                <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-900">Suscripción Fixia PRO</p>
                            <p className="text-sm text-gray-500">Mensual</p>
                        </div>
                        <span className="text-xl font-bold text-gray-900">$3.900</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-[#009EE3] transition-colors bg-white">
                            <div className="h-6 w-10 bg-blue-900 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Visa Débito **** 1234</p>
                                <p className="text-xs text-gray-500">Marcelo User</p>
                            </div>
                            <div className="h-4 w-4 rounded-full border-2 border-[#009EE3] flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-[#009EE3]" />
                            </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-[#009EE3] transition-colors bg-white opacity-60">
                            <div className="h-6 w-10 bg-destructive rounded flex items-center justify-center text-[8px] text-white font-bold">MAST</div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Mastercard **** 5678</p>
                            </div>
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg font-bold bg-[#009EE3] hover:bg-[#008ED6] text-white rounded-xl"
                        onClick={handlePayment}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Pagar $3.900"
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Pagás seguro con Mercado Pago</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
