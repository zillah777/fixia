"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, ShieldAlert, DollarSign, TrendingUp, Activity, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { InfoBadge } from "@/components/ui/info-badge"
import { TrendingUp as TrendingUpIcon } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Cargando métricas...</div>
    }

    if (!stats) return null

    return (
        <div className="space-y-8">
            {/* Header + Status */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>Actualizado en tiempo real</span>
                    </div>
                </div>

                {/* System Status */}
                <div className="flex flex-wrap gap-3 items-center">
                    <StatusBadge status="active" showLabel animated />
                    <span className="text-sm text-muted-foreground">Sistema operativo</span>
                </div>

                {/* Alert Info */}
                {stats?.verifications?.pending > 5 && (
                    <InfoBadge
                        type="warning"
                        text={`⚠️ Hay ${stats.verifications.pending} verificaciones pendientes que requieren atención inmediata.`}
                        dismissible
                        size="md"
                    />
                )}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {/* Usuarios & Suscripciones */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                    <Card className="border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuarios & Suscrip.</CardTitle>
                            <Users className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.users.total}</div>
                            <div className="flex flex-col gap-1 mt-2">
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Suscripciones:</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                        {stats.users.activeSubs} Activas
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                        {stats.users.trialSubs} En Prueba
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Conversión de Negocio */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversión (Marketplace)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                {stats.requests.conversion.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats.requests.completed} de {stats.requests.total} pedidos cerrados
                            </p>
                            <div className="w-full bg-muted h-1 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-1000"
                                    style={{ width: `${Math.min(stats.requests.conversion, 100)}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Ingresos Estimados */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos Est. (Mensual)</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">
                                ${new Intl.NumberFormat('es-AR').format(stats.revenue.monthly)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Basado en suscripciones activas
                            </p>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] mt-2">
                                +{new Intl.NumberFormat('es-AR').format(stats.users.trialSubs * 3900)} potenciales (Trials)
                            </Badge>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Acciones Pendientes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all bg-gradient-to-br from-orange-50/50 to-orange-100/20 dark:from-orange-950/30 dark:to-orange-900/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Acciones Requeridas</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                                {stats.verifications.pending}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Verificaciones de identidad pendientes
                            </p>
                            <Link href="/admin/verifications" className="text-xs font-bold text-orange-600 hover:underline mt-2 inline-block">
                                Gestionar ahora →
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Tendencia de Registros (7 días)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4 min-h-[300px]">
                            {stats.activity && stats.activity.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                                    <AreaChart data={stats.activity}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#666' }}
                                            tickFormatter={(str) => {
                                                const date = new Date(str);
                                                return date.toLocaleDateString('es-AR', { weekday: 'short' });
                                            }}
                                        />
                                        <YAxis
                                            hide={true}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            labelFormatter={(str) => new Date(str).toLocaleDateString()}
                                            labelStyle={{ fontWeight: 'bold', color: '#333' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorCount)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    Sin actividad reciente
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Top Profesionales</CardTitle>
                            <TrendingUpIcon className="h-4 w-4 text-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topPros && stats.topPros.length > 0 ? (
                                stats.topPros.map((pro: any, i: number) => (
                                    <motion.div
                                        key={pro.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 relative">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} />
                                                <AvatarFallback>{pro.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-accent text-[10px] flex items-center justify-center font-bold text-white shadow-sm">
                                                {i + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-none truncate">{pro.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {pro.jobs} {pro.jobs === 1 ? 'trabajo completado' : 'trabajos completados'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Aún no hay trabajos completados.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
