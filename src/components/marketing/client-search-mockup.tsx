"use strict";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, Filter, Heart, ShieldCheck, Clock } from "lucide-react";

export function ClientSearchMockup() {
    return (
        <div className="w-full h-full bg-stone-50 dark:bg-stone-900 rounded-xl overflow-hidden flex flex-col text-xs sm:text-sm font-sans border border-stone-200 dark:border-stone-800 shadow-sm">
            {/* Navbar-ish */}
            <div className="h-14 border-b border-stone-200 dark:border-stone-800 flex items-center px-4 gap-4 bg-white dark:bg-card">
                <div className="h-8 w-8 bg-stone-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <span className="text-white dark:text-stone-900 font-bold text-xs">F</span>
                </div>
                <div className="flex-1 bg-stone-100 dark:bg-stone-800 h-9 rounded-full flex items-center px-4 gap-2 border border-transparent hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-text">
                    <Search className="h-3.5 w-3.5 text-stone-500" />
                    <span className="text-stone-400 text-xs">Buscar electricista, plomero...</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-stone-200 dark:bg-stone-700"></div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-stone-50/50 dark:bg-stone-950 p-4 space-y-4 overflow-hidden">
                {/* Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <Button variant="outline" size="sm" className="h-7 rounded-full text-xs border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-sm">
                        <Filter className="h-3 w-3 mr-1.5" /> Filtros
                    </Button>
                    <Badge variant="secondary" className="h-7 px-3 rounded-full bg-stone-900 text-white hover:bg-stone-800 cursor-pointer font-medium border-0">Electricistas</Badge>
                    <Badge variant="outline" className="h-7 px-3 rounded-full bg-white border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer font-medium">Plomeros</Badge>
                    <Badge variant="outline" className="h-7 px-3 rounded-full bg-white border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer font-medium">Gasistas</Badge>
                </div>

                {/* Results */}
                <div className="space-y-3">
                    {[
                        { name: "Juan Pérez", role: "Electricista Matriculado", rating: 5.0, reviews: 42, verified: true, image: "JP" },
                        { name: "FixService", role: "Servicios Generales", rating: 4.8, reviews: 128, verified: true, image: "FS" },
                        { name: "Ana Gomez", role: "Arquitecta & Diseño", rating: 4.9, reviews: 15, verified: false, image: "AG" },
                    ].map((pro, i) => (
                        <Card key={i} className="shadow-sm border border-stone-200 dark:border-stone-800 bg-white dark:bg-card hover:shadow-md transition-all cursor-pointer group">
                            <CardContent className="p-4 flex gap-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 rounded-xl border border-stone-100">
                                        <AvatarFallback className={`text-xs font-bold ${i === 0 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>{pro.image}</AvatarFallback>
                                    </Avatar>
                                    {pro.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                                            <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-stone-900 dark:text-white truncate text-sm group-hover:text-primary transition-colors">{pro.name}</div>
                                            <div className="text-stone-500 text-xs truncate">{pro.role}</div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-stone-700 dark:text-stone-300">
                                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                            {pro.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 text-stone-500 text-[10px] sm:text-xs">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>A 2.5 km</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>Disponible hoy</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
