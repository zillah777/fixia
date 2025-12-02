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

import { AnimatePresence } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TRENDING_IMAGES = [
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // Aurora
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop", // Gradient
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop", // Abstract Liquid
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"  // Abstract Oil
]

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = React.useState({
        completedRequests: 0,
        activeRequests: 0,
        leads: 0,
        rating: 0,
        recentActivity: [] as any[],
        trendingCategory: "General"
    })
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % TRENDING_IMAGES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

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
                        <AvatarImage src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} />
                        <AvatarFallback>{user?.name?.substring(0, 2) || "CN"}</AvatarFallback>
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
                        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay for text readability */}

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
                                    style={{ backgroundImage: `url('${TRENDING_IMAGES[currentImageIndex]}')` }}
                                />
                            </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                        <CardContent className="relative h-full flex flex-col justify-end p-8 text-white z-30">
                            <Badge className="w-fit mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                <TrendingUp className="w-3 h-3 mr-2" /> Tendencia
                            </Badge>
                            <h2 className="text-3xl font-bold mb-2">Servicios de {stats.trendingCategory}</h2>
                            <p className="text-white/80 mb-6">La demanda de {stats.trendingCategory} ha subido esta semana.</p>
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
                            <div className="h-[200px] w-full">
                                {stats.recentActivity.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={(() => {
                                                const last7Days = [...Array(7)].map((_, i) => {
                                                    const d = new Date();
                                                    d.setDate(d.getDate() - i);
                                                    return d.toISOString().split('T')[0];
                                                }).reverse();

                                                return last7Days.map(date => ({
                                                    name: new Date(date).toLocaleDateString('es-AR', { weekday: 'short' }),
                                                    activity: stats.recentActivity.filter(a => a.date.startsWith(date)).length
                                                }));
                                            })()}
                                        >
                                            <defs>
                                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="activity" stroke="#8884d8" fillOpacity={1} fill="url(#colorActivity)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                        No hay suficientes datos para mostrar el gráfico.
                                    </div>
                                )}
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
                                {stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 bg-muted">
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${activity.title}&background=random`} />
                                                <AvatarFallback>ACT</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium line-clamp-1">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {activity.description} • {new Date(activity.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">
                                                {activity.status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        No hay actividad reciente.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}
