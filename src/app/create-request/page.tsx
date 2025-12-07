"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { SmartBudgetSuggestion } from "@/components/requests/smart-budget-suggestion"
import { ArrowLeft, Camera, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CATEGORIES } from "@/config/categories"
import { CategorySelector } from "@/components/shared/category-selector"

export default function CreateRequestPage() {
    const router = useRouter()
    const [category, setCategory] = useState<string>("")
    const [openCategory, setOpenCategory] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 0])
    const [urgency, setUrgency] = useState<string>("MEDIUM")

    // Image Upload State
    const [images, setImages] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (images.length >= 3) {
            toast.error("Máximo 3 imágenes permitidas")
            return
        }

        setIsUploading(true)
        const toastId = toast.loading("Subiendo imagen...")

        try {
            // 1. Get token
            const tokenRes = await fetch("/api/upload/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadType: "request_image" }),
                credentials: "include"
            })

            if (!tokenRes.ok) throw new Error("Error obteniendo token")
            const { signature, timestamp, folder, apiKey, uploadUrl } = await tokenRes.json()

            // 2. Upload to Cloudinary
            const formData = new FormData()
            formData.append("file", file)
            formData.append("api_key", apiKey)
            formData.append("timestamp", timestamp.toString())
            formData.append("signature", signature)
            formData.append("folder", folder)

            const uploadRes = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            })

            if (!uploadRes.ok) throw new Error("Error subiendo imagen")
            const data = await uploadRes.json()

            setImages(prev => [...prev, data.secure_url])
            toast.success("Imagen agregada", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Error al subir imagen", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!category) {
            toast.error("Selecciona una categoría")
            return
        }

        setIsLoading(true)

        try {
            const formData = new FormData(e.target as HTMLFormElement)

            // Build the payload manually to ensure all fields are correct
            const payload = {
                title: (document.getElementById("title") as HTMLInputElement).value,
                description: (document.getElementById("description") as HTMLTextAreaElement).value,
                categoryId: category,
                location: (document.getElementById("location") as HTMLInputElement).value,
                budget: budgetRange[1].toString(), // Send max budget
                urgency: urgency,
                images: images // Send the array of image URLs
            }

            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Error creating request")

            toast.success("¡Solicitud creada con éxito!")
            router.push("/dashboard/requests")
        } catch (error) {
            console.error(error)
            toast.error("Error al crear la solicitud")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="max-w-2xl mx-auto p-6">
                <Link href="/dashboard/requests">
                    <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cancelar y Volver
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Nueva Solicitud</h1>
                    <p className="text-muted-foreground mt-2">
                        Describe lo que necesitas y recibe presupuestos de profesionales verificados.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Basic Info */}
                    <Card className="border-none shadow-md">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría del Servicio</Label>
                                <CategorySelector
                                    value={category}
                                    onChange={setCategory}
                                    placeholder="Buscar categoría..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Título Breve</Label>
                                <Input id="title" name="title" placeholder="Ej: Reparación de canilla que gotea" className="h-12" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción Detallada</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe el problema con el mayor detalle posible..."
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 2: Budget (Smart Suggestion) */}
                    {category && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SmartBudgetSuggestion category={category} onBudgetChange={setBudgetRange} />
                        </div>
                    )}

                    {/* Step 3: Photos & Location */}
                    <Card className="border-none shadow-md">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label>Fotos del Problema (Opcional - Máx 3)</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Upload Button */}
                                    {images.length < 3 && (
                                        <div
                                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors bg-gray-50 cursor-pointer relative overflow-hidden"
                                            onClick={() => !isUploading && document.getElementById('req-image-upload')?.click()}
                                        >
                                            <Camera className="h-6 w-6 mb-2" />
                                            <span className="text-xs font-medium">{isUploading ? '...' : 'Agregar'}</span>
                                            <input
                                                type="file"
                                                id="req-image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                        </div>
                                    )}

                                    {/* Image Previews */}
                                    {images.map((url, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl bg-gray-100 relative group overflow-hidden">
                                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Placeholders to keep grid structure if needed, or just let grid handle it */}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                    <Input id="location" name="location" placeholder="Dirección o Barrio" className="pl-10 h-12" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="urgency">Urgencia</Label>
                                <Select value={urgency} onValueChange={setUrgency}>
                                    <SelectTrigger id="urgency" className="h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Baja (Puede esperar unos días)</SelectItem>
                                        <SelectItem value="MEDIUM">Media (Lo necesito esta semana)</SelectItem>
                                        <SelectItem value="HIGH">Alta (Lo necesito hoy/mañana)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold bg-black hover:bg-black/90 shadow-xl shadow-black/20 rounded-xl" disabled={isLoading}>
                        {isLoading ? "Publicando..." : "Publicar Solicitud"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
