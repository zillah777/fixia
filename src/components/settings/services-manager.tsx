"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, DollarSign, Tag, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { CATEGORIES } from "@/config/categories"
import { CategorySelector } from "@/components/shared/category-selector"
import { ServiceFormHelp } from "@/components/onboarding/form-help-context"
import { PriceFieldHelper, TagsFieldHelper } from "@/components/onboarding/form-field-helper"
import { useConfirmDialog } from "@/hooks/use-confirm-dialog"

export function ServicesManager() {
    const { confirm, ConfirmDialog } = useConfirmDialog()
    const [services, setServices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newServiceId, setNewServiceId] = useState<string | null>(null)

    // New Service Form
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        tags: [] as string[]
    })
    const [tagInput, setTagInput] = useState("")

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services")
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error("Failed to fetch services", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    // Auto-clear new service highlight after 5 seconds
    useEffect(() => {
        if (newServiceId) {
            const timer = setTimeout(() => setNewServiceId(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [newServiceId])

    const handleAddTag = () => {
        if (!tagInput.trim()) return
        if (newService.tags.includes(tagInput.trim())) return
        setNewService(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
        setTagInput("")
    }

    const removeTag = (tag: string) => {
        setNewService(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }

    const handleCreate = async () => {
        if (!newService.title || !newService.price || !newService.categoryId) {
            toast.error("Completa los campos obligatorios")
            return
        }

        if (services.length >= 4) {
            toast.error("Has alcanzado el límite de 4 servicios permitidos.")
            return
        }

        setIsCreating(true)
        try {
            const res = await fetch("/api/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newService)
            })

            if (!res.ok) throw new Error("Error creating service")

            const createdService = await res.json()
            toast.success("Servicio creado correctamente")
            setNewService({
                title: "",
                description: "",
                price: "",
                categoryId: "",
                tags: []
            })
            setNewServiceId(createdService.id)
            fetchServices()
        } catch (error) {
            toast.error("Error al crear servicio")
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = (id: string) => {
        confirm(
            '¿Eliminar servicio?',
            '¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.',
            async () => {
                try {
                    const res = await fetch(`/api/services/${id}`, {
                        method: "DELETE"
                    })

                    if (!res.ok) throw new Error("Error deleting service")

                    toast.success("Servicio eliminado")
                    setServices(prev => prev.filter(s => s.id !== id))
                } catch (error) {
                    toast.error("Error al eliminar servicio")
                }
            },
            {
                actionLabel: 'Eliminar',
                cancelLabel: 'Cancelar'
            }
        )
    }

    return (
        <div className="space-y-6">
            <ConfirmDialog />
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>Mis Servicios</CardTitle>
                            <CardDescription>
                                Administra los servicios que ofreces a los clientes.
                            </CardDescription>
                        </div>
                        <ServiceFormHelp />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* New Service Form */}
                        <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                            <h4 className="font-medium text-sm">Nuevo Servicio</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título del Servicio</Label>
                                    <Input
                                        placeholder="Ej. Reparación de Aire Acondicionado"
                                        value={newService.title}
                                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoría</Label>
                                    <CategorySelector
                                        value={newService.categoryId}
                                        onChange={(val) => setNewService({ ...newService, categoryId: val })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Precio Base (Estimado)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9"
                                            placeholder="0.00"
                                            value={newService.price}
                                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        />
                                    </div>
                                    <PriceFieldHelper />
                                </div>
                                <div className="space-y-2">
                                    <Label>Etiquetas</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ej. Rápido, Garantía"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <Button size="icon" variant="outline" onClick={handleAddTag}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {newService.tags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="px-2 py-1 text-xs">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">×</button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <TagsFieldHelper />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea
                                    placeholder="Detalles sobre lo que incluye este servicio..."
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleCreate} disabled={isCreating}>
                                    {isCreating ? "Creando..." : "Agregar Servicio"}
                                </Button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-8">Cargando servicios...</div>
                            ) : services.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No has creado ningún servicio aún.
                                </div>
                            ) : (
                                services.map((service) => {
                                    const isNew = service.id === newServiceId
                                    return (
                                    <div
                                        key={service.id}
                                        className={`flex items-start justify-between p-4 rounded-lg transition-all duration-300 ${
                                            isNew
                                                ? 'border-2 border-green-500 bg-green-50/50 shadow-lg scale-105'
                                                : 'border hover:bg-muted/10 transition-colors'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <h4 className="font-medium flex items-center gap-2">
                                                {service.title}
                                                {isNew && (
                                                    <Badge className="bg-green-500 hover:bg-green-600 gap-1 animate-pulse">
                                                        <Sparkles className="h-3 w-3" />
                                                        Nuevo
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {CATEGORIES.find(c => c.id === service.categoryId)?.label || service.categoryId}
                                                </Badge>
                                            </h4>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {service.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm pt-2">
                                                <span className="font-medium text-primary">
                                                    ${parseFloat(service.price).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                </span>
                                                {service.tags && service.tags.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {service.tags.map((t: string, i: number) => (
                                                            <span key={i} className="text-xs bg-secondary/50 px-1 rounded text-muted-foreground">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
