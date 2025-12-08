"use strict";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Calendar, MessageSquare, PieChart, BarChart, Star } from "lucide-react";

export function ProfessionalDashboardMockup() {
    return (
        <div className="w-full h-full bg-background rounded-xl overflow-hidden flex text-xs sm:text-sm">
            {/* Sidebar */}
            <div className="w-16 sm:w-48 bg-card border-r border-border flex flex-col py-4">
                <div className="px-4 mb-6 hidden sm:block">
                    <div className="h-6 w-20 bg-primary/20 rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-1 px-2">
                    {[
                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                        { icon: MessageSquare, label: "Mensajes", active: false },
                        { icon: Calendar, label: "Agenda", active: false },
                        { icon: PieChart, label: "Estadísticas", active: false },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}>
                            <item.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-muted/10">
                {/* Header */}
                <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6">
                    <h3 className="font-semibold text-foreground">Resumen</h3>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">En línea</Badge>
                        <Avatar className="h-7 w-7">
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* content */}
                <div className="p-4 sm:p-6 space-y-4 overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <Card>
                            <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                                <CardTitle className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase">Contactos Mes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 pt-0">
                                <div className="text-lg sm:text-2xl font-bold flex items-center">
                                    24 <span className="text-[10px] sm:text-xs font-normal text-green-500 ml-2">+5</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                                <CardTitle className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase">Calificación</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 pt-0">
                                <div className="text-lg sm:text-2xl font-bold flex items-center">
                                    4.9 <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="flex-1">
                        <CardHeader className="p-3 sm:p-4 border-b">
                            <CardTitle className="text-sm font-medium">Solicitudes Recientes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border-b last:border-0 hover:bg-muted/50">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">Instalación Eléctrica</div>
                                        <div className="text-xs text-muted-foreground truncate">Hace {i * 2 + 5} min • Belgrano</div>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px]">Nuevo</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
