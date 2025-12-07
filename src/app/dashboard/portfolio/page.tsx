"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Plus, Upload, X, Image as ImageIcon, Briefcase, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function PortfolioPage() {
    const [isDragging, setIsDragging] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [tags, setTags] = useState<string[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newService, setNewService] = useState({
        title: "",
        categoryId: "",
        price: "",
        description: ""
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services")
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error("Failed to fetch services", error)
            toast.error("Error al cargar servicios")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateService = async () => {
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newService,
                    tags
                })
            })

            if (!res.ok) throw new Error("Failed to create service")

            toast.success("Servicio creado correctamente")
            setIsDialogOpen(false)
            setNewService({ title: "", categoryId: "", price: "", description: "" })
            setTags([])
            fetchServices()
        } catch (error) {
            toast.error("Error al crear servicio")
        }
    }

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
        // Handle file drop logic here (Cloudinary upload)
        toast.info("Funcionalidad de subida de imágenes en desarrollo")
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
                                <Input
                                    id="title"
                                    placeholder="Ej. Instalación de Aire Acondicionado"
                                    value={newService.title}
                                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select onValueChange={(val) => setNewService({ ...newService, categoryId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electricidad">Electricidad</SelectItem>
                                        <SelectItem value="plomeria">Plomería</SelectItem>
                                        <SelectItem value="gas">Gas</SelectItem>
                                        <SelectItem value="aire">Aire Acondicionado</SelectItem>
                                        <SelectItem value="pintura">Pintura</SelectItem>
                                        <SelectItem value="carpinteria">Carpintería</SelectItem>
                                        <SelectItem value="otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Precio Base (Estimado)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe qué incluye tu servicio..."
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
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
                            <Button onClick={handleCreateService}>Guardar Servicio</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Drag & Drop Zone */}
            <Card className="border-2 border-dashed border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Sube imágenes a tu Galería General</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2">
                        Funcionalidad de subida en desarrollo.
                    </p>
                    <Button variant="outline" className="mt-6" disabled>
                        Seleccionar Archivos
                    </Button>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.length > 0 ? (
                        services.map((service) => (
                            <Card key={service.id} className="overflow-hidden group relative flex flex-col">
                                <div className="aspect-video bg-muted relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <Briefcase className="h-10 w-10 opacity-20" />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        {service.categoryId}
                                    </div>
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg truncate">{service.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex-grow">
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {service.tags.map((tag: string, i: number) => (
                                            <span key={i} className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                    <span className="font-bold">${Number(service.price).toLocaleString()}</span>
                                    <Button variant="ghost" size="sm">Editar</Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No tienes servicios creados aún.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
