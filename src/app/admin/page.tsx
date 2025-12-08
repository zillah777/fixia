"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, ShieldAlert, DollarSign, TrendingUp, Activity, AlertTriangle } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { InfoBadge } from "@/components/ui/info-badge"
import { TrendingUp as TrendingUpIcon } from "lucide-react"

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
                {/* Usuarios Totales */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                    <Card className="border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                            <Users className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.users.total}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats.users.pros} Profesionales / {stats.users.clients} Clientes
                            </p>
                            <StatusBadge status="active" showLabel={false} size="sm" animated className="mt-2" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Solicitudes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border border-border/30 hover:shadow-lg transition-all bg-gradient-to-br from-white/50 to-muted/20 dark:from-card/50 dark:to-muted/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
                            <FileText className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.requests.total}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats.requests.completed} Completadas
                            </p>
                            <StatusBadge status="active" showLabel={false} size="sm" className="mt-2" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Verificaciones Pendientes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all bg-gradient-to-br from-orange-50/50 to-orange-100/20 dark:from-orange-950/30 dark:to-orange-900/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verificaciones Pendientes</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                                {stats.verifications.pending}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Requieren acción inmediata
                            </p>
                            <StatusBadge status="warning" showLabel={false} size="sm" animated className="mt-2" />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Ingresos Estimados */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border border-accent/20 dark:border-accent/30 hover:shadow-lg transition-all bg-gradient-to-br from-emerald-50/50 to-emerald-100/20 dark:from-emerald-950/30 dark:to-emerald-900/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                                ${stats.revenue.total.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                +20.1% respecto al mes pasado
                            </p>
                            <StatusBadge status="active" showLabel={false} size="sm" className="mt-2" />
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Gráfico de Actividad (Próximamente)
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
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                                        #{i}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none">Profesional Top {i}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {10 - i} trabajos completados
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {i === 1 && (
                                            <StatusBadge status="active" showLabel={false} size="sm" animated />
                                        )}
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary">
                                                ${(15000 * (4 - i)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
