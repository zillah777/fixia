"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Lock, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function SubscriptionWall() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Left Side: Value Prop */}
                <div className="bg-black text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                            <Lock className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Acceso Profesional</h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-8">
                            Para responder solicitudes y contactar clientes, necesitas una suscripción activa. Únete a los mejores profesionales de tu zona.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                                <span>Acceso ilimitado a solicitudes</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                                <span>Perfil destacado con insignia PRO</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                                <span>0% de comisión por trabajo</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>Más de 500 profesionales activos</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Pricing & Action */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-gray-50">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Plan Mensual</h3>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-extrabold text-gray-900">$3.900</span>
                            <span className="text-xl text-gray-500">/mes</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Cancela cuando quieras. Sin contratos.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/dashboard/subscription/checkout">
                            <Button className="w-full h-14 text-lg font-bold bg-[#009EE3] hover:bg-[#008ED6] text-white shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.02]">
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                                Suscribirme con MercadoPago
                            </Button>
                        </Link>
                        <p className="text-xs text-center text-muted-foreground">
                            Pago seguro procesado por MercadoPago.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
