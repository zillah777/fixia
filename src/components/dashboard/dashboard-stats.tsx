"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Sample data
const completedServicesData = [
    { month: "Ene", completed: 12, pending: 4 },
    { month: "Feb", completed: 19, pending: 3 },
    { month: "Mar", completed: 15, pending: 5 },
    { month: "Abr", completed: 25, pending: 2 },
    { month: "May", completed: 22, pending: 4 },
    { month: "Jun", completed: 30, pending: 1 },
]

const revenueData = [
    { month: "Ene", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 5200, expenses: 2200 },
    { month: "Mar", revenue: 4800, expenses: 2290 },
    { month: "Abr", revenue: 6100, expenses: 2000 },
    { month: "May", revenue: 7200, expenses: 2181 },
    { month: "Jun", revenue: 8500, expenses: 2500 },
]

const categoryData = [
    { name: "Plomería", value: 35, color: "#6a9bcc" },
    { name: "Electricidad", value: 25, color: "#d97757" },
    { name: "Limpieza", value: 25, color: "#788c5d" },
    { name: "Otros", value: 15, color: "#b0aea5" },
]

const COLORS = ["#d97757", "#6a9bcc", "#788c5d", "#b0aea5"]

export function DashboardStats() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Servicios Completados */}
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Servicios Completados</CardTitle>
                    <CardDescription>Últimos 6 meses de actividad</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={completedServicesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#788c5d" name="Completados" />
                            <Bar dataKey="pending" fill="#d97757" name="Pendientes" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Ingresos vs Gastos */}
            <Card>
                <CardHeader>
                    <CardTitle>Ingresos & Gastos</CardTitle>
                    <CardDescription>Comparativa mensual</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6a9bcc" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6a9bcc" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d97757" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#d97757" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#6a9bcc"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                name="Ingresos"
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#d97757"
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                name="Gastos"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Distribución por Categoría */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribución por Servicio</CardTitle>
                    <CardDescription>Porcentaje de solicitudes</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent = 0 }) => `${name} ${(typeof percent === 'number' ? percent * 100 : 0).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#6a9bcc"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
