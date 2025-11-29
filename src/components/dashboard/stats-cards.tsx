"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Users, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCard {
    title: string
    value: string
    change: number
    trend: "up" | "down"
    icon: React.ReactNode
    color: "blue" | "green" | "purple" | "amber"
}

const statsCards: StatCard[] = [
    {
        title: "Ingresos Totales",
        value: "$45,231.89",
        change: 20.1,
        trend: "up",
        icon: <Wallet className="h-5 w-5" />,
        color: "blue",
    },
    {
        title: "Servicios Completados",
        value: "127",
        change: 15.3,
        trend: "up",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "green",
    },
    {
        title: "Clientes Nuevos",
        value: "42",
        change: 8.2,
        trend: "up",
        icon: <Users className="h-5 w-5" />,
        color: "purple",
    },
    {
        title: "Tiempo Promedio",
        value: "2.4h",
        change: 12.5,
        trend: "down",
        icon: <Clock className="h-5 w-5" />,
        color: "amber",
    },
]

const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
}

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {statsCards.map((stat) => (
                <Card key={stat.title} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={cn(
                                    "p-3 rounded-lg",
                                    colorMap[stat.color]
                                )}
                            >
                                {stat.icon}
                            </div>
                            <div
                                className={`flex items-center gap-1 text-sm font-semibold ${
                                    stat.trend === "up"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {stat.change}%
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
