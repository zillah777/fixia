"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Plus, Upload, X, Image as ImageIcon, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PortfolioPage() {
    const [isDragging, setIsDragging] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [tags, setTags] = useState<string[]>([])

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
                    <h2 className="text-3xl font-bold tracking-tight">Mis Servicios y Portafolio</h2>
                    <p className="text-muted-foreground">Gestiona tus servicios ofrecidos y muestra tus trabajos.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Servicio
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                            <DialogDescription>
                                Detalla el servicio que ofreces para que los clientes te encuentren.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título del Servicio</Label>
                                <Input id="title" placeholder="Ej. Instalación de Aire Acondicionado" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electricidad">Electricidad</SelectItem>
                                        <SelectItem value="plomeria">Plomería</SelectItem>
                                        <SelectItem value="gas">Gas</SelectItem>
                                        <SelectItem value="aire">Aire Acondicionado</SelectItem>
                                        <SelectItem value="otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Precio Base (Estimado)</Label>
                                <Input id="price" type="number" placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea id="description" placeholder="Describe qué incluye tu servicio..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tags / Palabras Clave</Label>
                                <TagInput
                                    value={tags}
                                    onChange={setTags}
                                    placeholder="Ej. Split, Mantenimiento, Carga de Gas..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit">Guardar Servicio</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                    <h3 className="text-lg font-semibold">Sube imágenes a tu Galería General</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2">
                        Arrastra y suelta tus archivos aquí, o haz clic para seleccionar.
                    </p>
                    <Button variant="outline" className="mt-6">
                        Seleccionar Archivos
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Example Service Card */}
                <Card className="overflow-hidden group relative flex flex-col">
                    <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <Briefcase className="h-10 w-10 opacity-20" />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Electricidad
                        </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg truncate">Instalación Eléctrica</CardTitle>
                        <CardDescription className="line-clamp-2">Cableado completo para obras nuevas y reformas.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full">Obras</span>
                            <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full">Tableros</span>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="font-bold">$15.000</span>
                        <Button variant="ghost" size="sm">Editar</Button>
                    </CardFooter>
                </Card>

                {/* Example Portfolio Item */}
                <Card className="overflow-hidden group relative">
                    <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 opacity-20" />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base truncate">Trabajo #123</CardTitle>
                        <CardDescription className="text-xs">Galería General</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
