"use strict";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Calendar, MessageSquare, PieChart, BarChart, Star, TrendingUp, Users, DollarSign } from "lucide-react";

export function ProfessionalDashboardMockup() {
    return (
        <div className="w-full h-full bg-stone-50 dark:bg-stone-900 rounded-xl overflow-hidden flex text-xs sm:text-sm font-sans border border-stone-200 dark:border-stone-800 shadow-sm">
            {/* Sidebar */}
            <div className="w-16 sm:w-56 bg-white dark:bg-card border-r border-stone-200 dark:border-stone-800 flex flex-col py-6">
                <div className="px-6 mb-8 hidden sm:block">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-stone-900 dark:bg-white rounded-md"></div>
                        <span className="font-bold text-lg tracking-tight">Fixia<span className="text-stone-400">Pro</span></span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 px-3">
                    {[
                        { icon: LayoutDashboard, label: "Resumen", active: true },
                        { icon: MessageSquare, label: "Mensajes", active: false, badge: 3 },
                        { icon: Calendar, label: "Agenda", active: false },
                        { icon: DollarSign, label: "Finanzas", active: false },
                        { icon: PieChart, label: "Estadísticas", active: false },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-default ${item.active ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-medium' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}>
                            <div className="flex items-center gap-3">
                                <item.icon className={`h-4 w-4 ${item.active ? 'text-stone-900 dark:text-white' : ''}`} />
                                <span className="hidden sm:inline">{item.label}</span>
                            </div>
                            {item.badge && <span className="hidden sm:flex h-5 w-5 items-center justify-center bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] font-bold rounded-full">{item.badge}</span>}
                        </div>
                    ))}
                </div>

                <div className="mt-auto px-3">
                    <div className="p-3 rounded-xl bg-stone-900 dark:bg-stone-800 text-white hidden sm:block">
                        <div className="text-xs font-medium opacity-80 mb-1">Plan Profesional</div>
                        <div className="text-sm font-bold">Nivel Oro</div>
                        <div className="w-full bg-white/20 h-1 rounded-full mt-2">
                            <div className="bg-white h-1 rounded-full w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-stone-50/50 dark:bg-stone-950">
                {/* Header */}
                <div className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-card flex items-center justify-between px-6">
                    <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-lg">Hola, Martín</h3>
                        <p className="text-xs text-stone-500 hidden sm:block">Aquí está el resumen de tu actividad hoy</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900/30">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium">Disponible</span>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-white dark:border-stone-800 shadow-sm">
                            <AvatarFallback className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200">MG</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* content */}
                <div className="p-6 space-y-6 overflow-hidden">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                                        <Users className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                                    </div>
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 text-[10px]">+12%</Badge>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 dark:text-white">1,240</div>
                                <div className="text-[10px] text-stone-500 font-medium mt-1">Visitas al perfil</div>
                            </CardContent>
                        </Card>
                        <Card className="border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                                        <Star className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                                    </div>
                                    <Badge variant="secondary" className="bg-stone-100 text-stone-700 border-stone-200 text-[10px]">4.9</Badge>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 dark:text-white">48</div>
                                <div className="text-[10px] text-stone-500 font-medium mt-1">Reseñas totales</div>
                            </CardContent>
                        </Card>
                        <Card className="border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 dark:text-white">15</div>
                                <div className="text-[10px] text-stone-500 font-medium mt-1">Trabajos activos</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="flex-1 border-stone-200 dark:border-stone-800 shadow-sm bg-white dark:bg-card">
                        <CardHeader className="p-4 border-b border-stone-100 dark:border-stone-800 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-stone-900 dark:text-white">Solicitudes Recientes</CardTitle>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-stone-500">Ver todas</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[
                                { title: "Instalación de Aire Acondicionado", loc: "Palermo, CABA", time: "2 min", price: "$45k - $60k" },
                                { title: "Reparación Tablero Eléctrico", loc: "Belgrano, CABA", time: "15 min", price: "$20k - $30k" },
                                { title: "Mantenimiento General", loc: "Recoleta, CABA", time: "1h", price: "A convenir" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-xs group-hover:bg-stone-900 group-hover:text-white transition-colors">
                                        {item.title.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-stone-900 dark:text-white truncate text-sm">{item.title}</div>
                                        <div className="text-xs text-stone-500 truncate flex items-center gap-2">
                                            <span>{item.loc}</span>
                                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                            <span>Hace {item.time}</span>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs font-bold text-stone-900 dark:text-white">{item.price}</div>
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal bg-stone-100 text-stone-600">Nueva</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
