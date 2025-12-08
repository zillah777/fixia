"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, TrendingUp, Users, DollarSign, ShoppingBag, ArrowUpRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/notifications/notification-center"
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

import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function DashboardPage() {
    const { user } = useAuth()
    const searchParams = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            toast.success("¡Tu cuenta ha sido verificada exitosamente!", {
                duration: 5000,
                description: "Ahora tienes acceso completo a todas las funciones."
            })
        }
    }, [searchParams])

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

    const chartData = React.useMemo(() => {
        if ((stats as any).weeklyStats) {
            return (stats as any).weeklyStats;
        }

        // Fallback for other roles (Client/Admin) if not yet implemented
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => ({
            name: new Date(date).toLocaleDateString('es-AR', { weekday: 'short' }),
            activity: stats.recentActivity.filter(a => a.date.startsWith(date)).length
        }));
    }, [stats.recentActivity, (stats as any).weeklyStats]);

    return (
        <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 lg:p-8 font-sans">
            {/* Header - Fully Responsive */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Hola {user?.name?.split(' ')[0] || 'Usuario'}, ¡Bienvenido!
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">Aquí tienes un resumen de tu actividad.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                            className="h-10 w-48 lg:w-64 rounded-full bg-white dark:bg-card border border-border/30 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                            placeholder="Buscar..."
                        />
                    </div>
                    <NotificationCenter />
                </div>
            </header>

            {/* Bento Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
                {/* Visual Hero Widget - Spans 4 columns - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-4 row-span-2">
                    <Card className="h-full border-none shadow-md hover:shadow-warm transition-all overflow-hidden relative group bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
                        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Overlay for text readability */}

                        <AnimatePresence>
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                className="absolute inset-0 bg-background/50"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('${TRENDING_IMAGES[currentImageIndex]}')`,
                                    }}
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
                            <Link href="/dashboard/opportunities">
                                <Button className="w-full bg-white text-black hover:bg-white/90 border-none shadow-lg">
                                    Ver Oportunidades
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Widgets - Fully Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Common Card: Completed Requests/Jobs */}
                    <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                                {user?.role === 'PROFESSIONAL' ? 'Trabajos Completados' : 'Solicitudes Completadas'}
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-accent flex-shrink-0" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.completedRequests}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total histórico
                            </p>
                        </CardContent>
                    </Card>

                    {/* Professional Specific Cards */}
                    {user?.role === 'PROFESSIONAL' && (
                        <>
                            <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Servicios Publicados</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-accent flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">{(stats as any).servicesCount || 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Activos en el mercado
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Calificación</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-accent flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">{Number(stats.rating).toFixed(1)}</div>
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
                            <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Solicitudes Activas</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-accent flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.activeRequests}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        En búsqueda o proceso
                                    </p>
                                </CardContent>
                            </Card>
                            {/* Placeholder for layout balance */}
                            <Card className="border border-border/30 shadow-sm opacity-0 pointer-events-none hidden lg:block">
                                <CardContent></CardContent>
                            </Card>
                        </>
                    )}

                    {/* Admin Specific Cards */}
                    {user?.role === 'ADMIN' && (
                        <>
                            <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Usuarios Totales</CardTitle>
                                    <Users className="h-4 w-4 text-accent flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.leads}</div>
                                </CardContent>
                            </Card>
                            <Card className="border border-border/30 shadow-sm hover:shadow-warm hover:border-accent/30 transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Solicitudes Totales</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-accent flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.activeRequests}</div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </motion.div>

                {/* Large Chart Area - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-8">
                    <Card className="h-full border border-border/30 shadow-sm hover:shadow-warm transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
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
                            <div className="h-[200px] w-full min-h-[200px]" style={{ minHeight: '200px' }}>
                                {stats.recentActivity.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart
                                            data={chartData}
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

                {/* Recent Activity / List - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-4">
                    <Card className="h-full border border-border/30 shadow-sm hover:shadow-warm transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
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
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {activity.description} • {new Date(activity.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] shrink-0">
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
