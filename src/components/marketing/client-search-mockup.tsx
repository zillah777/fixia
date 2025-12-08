"use strict";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Star, Filter, Heart } from "lucide-react";

export function ClientSearchMockup() {
    return (
        <div className="w-full h-full bg-background rounded-xl overflow-hidden flex flex-col text-xs sm:text-sm">
            {/* Navbar-ish */}
            <div className="h-12 border-b border-border flex items-center px-4 gap-3 bg-card">
                <div className="h-4 w-4 bg-primary/20 rounded-full"></div>
                <div className="flex-1 bg-muted/30 h-8 rounded-lg flex items-center px-3 gap-2">
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <div className="h-2 w-20 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="h-6 w-6 rounded-full bg-muted/50"></div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-muted/10 p-4 space-y-3 overflow-hidden font-sans">
                {/* Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <Badge variant="secondary" className="bg-card hover:bg-card border-none shadow-sm"><Filter className="h-3 w-3 mr-1" /> Filtros</Badge>
                    <Badge variant="outline" className="bg-transparent">Electricistas</Badge>
                    <Badge variant="outline" className="bg-transparent">Plomeros</Badge>
                    <Badge variant="outline" className="bg-transparent">Gasistas</Badge>
                </div>

                {/* Results */}
                <div className="space-y-3">
                    {[
                        { name: "Juan Pérez", role: "Electricista Matriculado", rating: 5.0, reviews: 42, verified: true },
                        { name: "FixService", role: "Servicios Generales", rating: 4.8, reviews: 128, verified: true },
                        { name: "Ana Gomez", role: "Arquitecta", rating: 4.9, reviews: 15, verified: false },
                    ].map((pro, i) => (
                        <Card key={i} className="shadow-sm border-0 sm:border animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                            <CardContent className="p-3 flex gap-3">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                    <Avatar className="h-full w-full rounded-lg">
                                        <AvatarFallback>{pro.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold truncate">{pro.name}</div>
                                            <div className="text-muted-foreground text-xs">{pro.role}</div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                            <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                                            {pro.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-muted-foreground text-[10px] sm:text-xs">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>A 2.5 km</span>
                                        </div>
                                        {pro.verified && (
                                            <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-blue-50 text-blue-600 border-blue-100">Verificado</Badge>
                                        )}
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
