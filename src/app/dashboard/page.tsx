"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, TrendingUp, Users, DollarSign, ShoppingBag, ArrowUpRight, Calendar, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/providers/auth-provider"
import { ProfessionalProfileAlert } from "@/components/professional-profile-alert"

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
        if (searchParams?.get('verified') === 'true') {
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
        <div className="min-h-screen font-sans pb-12">
            {/* Header with Search and Welcome */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 md:mb-10">
                <div className="min-w-0 space-y-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Hola, {user?.name?.split(' ')[0] || 'Usuario'}
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base font-medium flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Panel de Control • {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <input
                            className="h-12 w-64 lg:w-80 rounded-full bg-white dark:bg-card border border-border/40 pl-11 pr-5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/70"
                            placeholder="Buscar servicios, solicitudes..."
                        />
                    </div>
                    <div className="bg-white dark:bg-card rounded-full p-1 shadow-sm border border-border/40">
                        <NotificationCenter />
                    </div>
                </div>
            </header>

            {/* Professional Profile Completion Alert */}
            <ProfessionalProfileAlert />

            {/* Bento Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
                {/* Visual Hero Widget - Spans 4 columns - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-12 lg:col-span-4 row-span-2">
                    <Card className="h-full border-none shadow-xl shadow-stone-200/40 dark:shadow-none transition-all overflow-hidden relative group rounded-3xl">
                        <div className="absolute inset-0 bg-black/10 z-10" />

                        <AnimatePresence>
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
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

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20" />

                        <CardContent className="relative h-full flex flex-col justify-end p-8 text-white z-30">
                            <Badge className="w-fit mb-4 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md px-3 py-1.5 uppercase tracking-wider text-[10px] font-bold">
                                <TrendingUp className="w-3 h-3 mr-2" /> Tendencia Semanal
                            </Badge>
                            <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight">Servicios de {stats.trendingCategory}</h2>
                            <p className="text-white/80 mb-6 font-medium text-sm leading-relaxed max-w-[90%]">Hubo un aumento del 25% en búsquedas de esta categoría. ¡Es un buen momento para explorar!</p>
                            <Link href="/dashboard/opportunities" className="w-full block">
                                <Button className="w-full bg-white text-black hover:bg-white/90 border-0 shadow-lg font-bold h-12 rounded-xl">
                                    Ver Oportunidades <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Widgets - Fully Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Common Card: Completed Requests/Jobs */}
                    <Card className="border-none shadow-lg shadow-stone-100 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all bg-white dark:bg-card rounded-3xl group overflow-hidden">
                        <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {user?.role === 'PROFESSIONAL' ? 'Trabajos Completados' : 'Solicitudes Completadas'}
                            </CardTitle>
                            <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">{stats.completedRequests}</div>
                            <p className="text-xs text-muted-foreground font-medium flex items-center">
                                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-green-600 font-bold">+12%</span>
                                <span className="ml-1 opacity-70">vs mes anterior</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Professional Specific Cards */}
                    {user?.role === 'PROFESSIONAL' && (
                        <>
                            <Card className="border-none shadow-lg shadow-stone-100 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all bg-white dark:bg-card rounded-3xl group overflow-hidden">
                                <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Servicios Activos</CardTitle>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        <Briefcase className="h-5 w-5 flex-shrink-0" /> {/* Changed icon to Briefcase manually if available, else standard */}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <div className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">{(stats as any).servicesCount || 0}</div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        Servicios publicados
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg shadow-stone-100 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all bg-white dark:bg-card rounded-3xl group overflow-hidden">
                                <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Calificación</CardTitle>
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-xl text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                                        <TrendingUp className="h-5 w-5 flex-shrink-0" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <div className="text-4xl font-extrabold text-foreground mb-1 tracking-tight flex items-baseline gap-1">
                                        {Number(stats.rating).toFixed(1)} <span className="text-lg text-muted-foreground font-medium">/ 5.0</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium text-yellow-600 flex items-center">
                                        ⭐⭐⭐⭐⭐
                                    </p>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Client Specific Cards */}
                    {user?.role === 'CLIENT' && (
                        <Card className="border-none shadow-lg shadow-stone-100 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all bg-white dark:bg-card rounded-3xl group overflow-hidden">
                            <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
                                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Solicitudes Activas</CardTitle>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                    <Search className="h-5 w-5 flex-shrink-0" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="text-4xl font-extrabold text-foreground mb-1 tracking-tight">{stats.activeRequests}</div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    En proceso de búsqueda
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Large Chart Area - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-8">
                    <Card className="h-full border-none shadow-xl shadow-stone-200/50 dark:shadow-none overflow-hidden rounded-[2rem] bg-white dark:bg-card">
                        <CardHeader className="px-8 pt-8">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <CardTitle className="text-xl font-bold">Rendimiento</CardTitle>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">Tu actividad en los últimos 7 días</p>
                                </div>
                                <div className="hidden sm:flex gap-2 p-1 bg-stone-100 dark:bg-muted rounded-full">
                                    <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs font-semibold bg-white shadow-sm text-foreground">Semana</Button>
                                    <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground">Mes</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 px-4 pb-4">
                            <div className="h-[250px] w-full">
                                {stats.recentActivity.length >= 0 ? ( // Changed condition to >= 0 or similar to mostly show empty chart with lines if 0, but logic inside handles it.
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickMargin={10}
                                            />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                    backgroundColor: 'hsl(var(--popover))',
                                                    color: 'hsl(var(--popover-foreground))',
                                                    padding: '12px 16px'
                                                }}
                                                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}
                                                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="activity"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorActivity)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <TrendingUp className="h-10 w-10 opacity-20 mb-4" />
                                        <p className="font-medium text-sm">Sin datos suficientes aún.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity / List - Responsive */}
                <motion.div variants={item} className="col-span-1 md:col-span-12 lg:col-span-4">
                    <Card className="h-full border-none shadow-xl shadow-stone-200/50 dark:shadow-none bg-white dark:bg-card rounded-[2rem] overflow-hidden">
                        <CardHeader className="px-8 pt-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center justify-between">
                                Actividad Reciente
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-bold hover:bg-primary/10 rounded-full px-3">Ver Todo</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-4">
                                {stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.slice(0, 5).map((activity, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-muted/30 transition-colors group cursor-default">
                                            <div className="mt-1 h-10 w-10 rounded-full bg-stone-100 dark:bg-muted flex items-center justify-center text-xl shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                                                {i % 2 === 0 ? "🔔" : "💼"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-foreground truncate">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 font-medium leading-relaxed">
                                                    {activity.description}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground/60 font-semibold mt-1.5 block uppercase tracking-wide">
                                                    {new Date(activity.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {activity.status && (
                                                <Badge variant="secondary" className="text-[9px] h-5 px-1.5 bg-stone-100 dark:bg-muted text-foreground border-0 font-bold">
                                                    {activity.status}
                                                </Badge>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 flex flex-col items-center">
                                        <div className="h-16 w-16 bg-stone-50 dark:bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                            <Bell className="h-6 w-6 text-muted-foreground/40" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Todo está tranquilo</p>
                                        <p className="text-xs text-muted-foreground max-w-[180px] mt-1">No hay actividad reciente para mostrar en este momento.</p>
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
