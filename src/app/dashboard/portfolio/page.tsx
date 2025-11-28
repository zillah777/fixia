"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PortfolioPage() {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        // Handle file drop logic here
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mi Portafolio</h2>
                    <p className="text-muted-foreground">Gestiona las imágenes de tus trabajos realizados.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Guardar Cambios
                </Button>
            </div>

            {/* Drag & Drop Zone */}
            <Card
                className={cn(
                    "border-2 border-dashed transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Sube imágenes de tus trabajos</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2">
                        Arrastra y suelta tus archivos aquí, o haz clic para seleccionar.
                        Soporta JPG, PNG y WEBP.
                    </p>
                    <Button variant="outline" className="mt-6">
                        Seleccionar Archivos
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Example Portfolio Item */}
                <Card className="overflow-hidden group relative">
                    <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 opacity-20" />
                        </div>
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base truncate">Instalación Eléctrica Completa</CardTitle>
                        <CardDescription className="text-xs">Subido hace 2 días</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="overflow-hidden group relative">
                    <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 opacity-20" />
                        </div>
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base truncate">Reparación de Cañerías</CardTitle>
                        <CardDescription className="text-xs">Subido hace 1 semana</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
