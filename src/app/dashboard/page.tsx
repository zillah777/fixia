"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, TrendingUp, Users, DollarSign, ShoppingBag, ArrowUpRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/providers/auth-provider"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = React.useState({
        completedRequests: 0,
        activeRequests: 0,
        leads: 0,
        rating: 0
    })

    React.useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setStats(data)
                }
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hola {user?.name?.split(' ')[0] || 'Usuario'}, ¡Bienvenido!</h1>
                    <p className="text-muted-foreground mt-1">Aquí tienes un resumen de tu actividad hoy.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <input
                            className="h-10 w-64 rounded-full bg-white border-none pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Buscar..."
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            {/* Bento Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
                {/* Visual Hero Widget - Spans 4 columns */}
                <motion.div variants={item} className="md:col-span-4 row-span-2">
                    <Card className="h-full border-none shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-aurora opacity-90 transition-opacity group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />

                        <CardContent className="relative h-full flex flex-col justify-end p-8 text-white">
                            <Badge className="w-fit mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                <TrendingUp className="w-3 h-3 mr-2" /> Tendencia
                            </Badge>
                            <h2 className="text-3xl font-bold mb-2">Servicios de Verano</h2>
                            <p className="text-white/80 mb-6">La demanda de instalación de A/C ha subido un 45% esta semana.</p>
                            <Button className="w-full bg-white text-black hover:bg-white/90 border-none shadow-lg">
                                Ver Oportunidades
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Widgets */}
                <motion.div variants={item} className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Common Card: Completed Requests/Jobs */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {user?.role === 'PROFESSIONAL' ? 'Trabajos Completados' : 'Solicitudes Completadas'}
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedRequests}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total histórico
                            </p>
                        </CardContent>
                    </Card>

                    {/* Professional Specific Cards */}
                    {user?.role === 'PROFESSIONAL' && (
                        <>
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Oportunidades Activas</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.leads}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Leads y trabajos en curso
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Calificación</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{Number(stats.rating).toFixed(1)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Promedio de reseñas
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Client Specific Cards */}
                    {user?.role === 'CLIENT' && (
                        <>
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Activas</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.activeRequests}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        En búsqueda o proceso
                                    </p>
                                </CardContent>
                            </Card>
                            {/* Placeholder for 3rd card layout balance if needed, or just leave 2 cols */}
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow opacity-0 pointer-events-none md:block hidden">
                                <CardContent></CardContent>
                            </Card>
                        </>
                    )}

                    {/* Admin Specific Cards */}
                    {user?.role === 'ADMIN' && (
                        <>
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Totales</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.leads}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Solicitudes Totales</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.activeRequests}</div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </motion.div>

                {/* Large Chart Area */}
                <motion.div variants={item} className="md:col-span-8">
                    <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Estadísticas de Rendimiento</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-full h-8">Semana</Button>
                                    <Button variant="default" size="sm" className="rounded-full h-8">Mes</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full bg-muted/20 rounded-xl flex items-center justify-center text-muted-foreground">
                                Gráfico de Área (Placeholder)
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity / List */}
                <motion.div variants={item} className="md:col-span-4">
                    <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 bg-muted">
                                            <AvatarImage src={`/avatars/0${i + 1}.png`} />
                                            <AvatarFallback>U{i}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Nueva solicitud de servicio</p>
                                            <p className="text-xs text-muted-foreground">Hace 2 horas • Plomería</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}
