"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Rocket, Gift, ExternalLink, RefreshCw, Star, ShieldCheck, Mail, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function GrowthPage() {
    const [pros, setPros] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const fetchPros = async (query = "") => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/growth?search=${query}`)
            if (res.ok) {
                const data = await res.json()
                setPros(data)
            }
        } catch (error) {
            console.error("Error fetching pros:", error)
            toast.error("Error al cargar profesionales")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPros()
    }, [])

    const handleExtendTrial = async (userId: string) => {
        setProcessingId(userId)
        try {
            const res = await fetch("/api/admin/growth", {
                method: "POST",
                body: JSON.stringify({ userId, action: "EXTEND_TRIAL", days: 30 })
            })
            if (res.ok) {
                toast.success("¡Suscripción de prueba extendida 30 días!")
                fetchPros(search)
            } else {
                toast.error("Error al extender suscripción")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setProcessingId(null)
        }
    }

    const copyInviteLink = () => {
        const link = `${window.location.origin}/register?role=professional&ref=admin_expert`
        navigator.clipboard.writeText(link)
        toast.success("Link de invitación copiado al portapapeles")
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-black text-white rounded-xl shadow-lg">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Centro de Crecimiento</h1>
                        <p className="text-muted-foreground">Herramientas expertas para reclutamiento y expansión.</p>
                    </div>
                </div>
            </div>

            {/* Expert Tools Setup */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-emerald-200 bg-emerald-50/30 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 text-emerald-600/10 group-hover:scale-110 transition-transform">
                        <Gift className="h-16 w-16" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-emerald-700">Reclutamiento Activo</CardTitle>
                        <CardDescription className="text-emerald-600">Invita a profesionales TOP con 30 días gratis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={copyInviteLink}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Copiar Link de Invitación
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-[10px] text-emerald-600 font-medium">Este link aplica automáticamente el plan pro de prueba.</p>
                    </CardFooter>
                </Card>

                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle className="text-blue-700">Audit de Liquidez</CardTitle>
                        <CardDescription className="text-blue-600">Analiza si hay suficientes profesionales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full border-blue-300 text-blue-700 font-bold gap-2" asChild>
                            <Link href="/admin/dashboard">Ir al Dashboard →</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50/30">
                    <CardHeader>
                        <CardTitle className="text-orange-700">Status de Marca</CardTitle>
                        <CardDescription className="text-orange-600">Gestiona insignias de confianza.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full border-orange-300 text-orange-700 font-bold gap-2" asChild>
                            <Link href="/admin/verifications">Ver Verificaciones →</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Professional Management Panel */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-accent" />
                        Gestión de Profesionales Elite
                    </h2>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o email..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                if (e.target.value === "") fetchPros()
                            }}
                            onKeyDown={(e) => e.key === "Enter" && fetchPros(search)}
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : pros.length === 0 ? (
                        <Card className="bg-muted/30 border-dashed border-2">
                            <CardContent className="py-10 text-center text-muted-foreground">
                                No se encontraron profesionales para tu búsqueda.
                            </CardContent>
                        </Card>
                    ) : (
                        pros.map((pro) => (
                            <motion.div
                                key={pro.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-md transition-shadow border-border/50">
                                    <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} />
                                                <AvatarFallback>{pro.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-lg">{pro.name}</h3>
                                                    {pro.subscriptionStatus === 'active' && <Badge className="bg-emerald-500">PAID</Badge>}
                                                    {pro.subscriptionStatus === 'trial' && <Badge variant="outline" className="text-blue-600 border-blue-200">TRIAL</Badge>}
                                                    {!pro.subscriptionStatus && <Badge variant="secondary">INACTIVO</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {pro.email}</span>
                                                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {pro.profile?.ratingAvg || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                            <div className="text-right w-full sm:w-auto">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Vencimiento Suscr.</p>
                                                <p className="text-sm font-medium flex items-center justify-end gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {pro.subscriptionEndsAt ? new Date(pro.subscriptionEndsAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleExtendTrial(pro.id)}
                                                disabled={processingId === pro.id}
                                                className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 font-bold gap-2"
                                            >
                                                {processingId === pro.id ?
                                                    <RefreshCw className="h-4 w-4 animate-spin" /> :
                                                    <Gift className="h-4 w-4" />
                                                }
                                                Regalar 30 Días Pro
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
