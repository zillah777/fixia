"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Image as ImageIcon, Briefcase, FileText } from "lucide-react"
import { toast } from "sonner"

interface ProfessionalProfileFormProps {
    initialData: any
    onSave: (data: any) => Promise<void>
}

export function ProfessionalProfileForm({ initialData, onSave }: ProfessionalProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        // Registration data
        yearsExperience: initialData?.yearsExperience || "",
        education: initialData?.education || "",
        bio: initialData?.bio || "",
        // Settings/Additional data
        certification: initialData?.certification || "",
        licenseNumber: initialData?.licenseNumber || "",
        experience: initialData?.experience || "",
        tags: (() => {
            if (Array.isArray(initialData?.tags)) return initialData.tags;
            if (typeof initialData?.tags === 'string') {
                try {
                    const parsed = JSON.parse(initialData.tags || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                } catch { return []; }
            }
            return [];
        })(),
        portfolioImages: (() => {
            if (Array.isArray(initialData?.portfolioImages)) return initialData.portfolioImages;
            if (typeof initialData?.portfolioImages === 'string') {
                try {
                    const parsed = JSON.parse(initialData.portfolioImages || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                } catch { return []; }
            }
            return [];
        })()
    })
    const [newTag, setNewTag] = useState("")

    const handleAddTag = () => {
        if (!newTag.trim()) return
        if (formData.tags.length >= 5) {
            toast.error("Máximo 5 etiquetas")
            return
        }
        if (formData.tags.includes(newTag.trim())) {
            toast.error("La etiqueta ya existe")
            return
        }
        setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
        setNewTag("")
    }

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) })
    }

    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const toastId = toast.loading("Subiendo imagen...")

        try {
            const tokenRes = await fetch("/api/upload/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadType: "portfolio" }),
                credentials: "include"
            })

            if (!tokenRes.ok) throw new Error("Error obteniendo token")
            const { signature, timestamp, folder, apiKey, uploadUrl } = await tokenRes.json()

            const data = new FormData()
            data.append("file", file)
            data.append("api_key", apiKey)
            data.append("timestamp", timestamp.toString())
            data.append("signature", signature)
            data.append("folder", folder)

            const uploadRes = await fetch(uploadUrl, { method: "POST", body: data })
            if (!uploadRes.ok) throw new Error("Error subiendo a Cloudinary")
            const uploadData = await uploadRes.json()

            setFormData(prev => ({
                ...prev,
                portfolioImages: [...prev.portfolioImages, uploadData.secure_url]
            }))

            toast.success("Imagen agregada", { id: toastId })
        } catch (error) {
            console.error(error)
            toast.error("Error al subir imagen", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            portfolioImages: prev.portfolioImages.filter((_: any, i: number) => i !== index)
        }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await onSave({
                ...formData,
                tags: JSON.stringify(formData.tags),
                portfolioImages: JSON.stringify(formData.portfolioImages)
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Registration Data - Education & Experience */}
            <Card>
                <CardHeader>
                    <CardTitle>Información de Registro</CardTitle>
                    <CardDescription>
                        Datos ingresados durante tu registro (puedes editarlos aquí).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="yearsExperience">Años de Experiencia</Label>
                            <Input
                                id="yearsExperience"
                                type="number"
                                placeholder="Ej. 5"
                                value={formData.yearsExperience}
                                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="education">Educación / Formación</Label>
                            <Input
                                id="education"
                                placeholder="Ej. Técnico en Electricidad"
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Descripción Personal</Label>
                        <Textarea
                            id="bio"
                            placeholder="Cuéntanos un poco sobre ti y tu experiencia..."
                            className="min-h-[80px]"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Credenciales Profesionales</CardTitle>
                    <CardDescription>
                        Información adicional que valida tu experiencia y aptitudes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título / Certificación Principal</Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="title"
                                    placeholder="Ej. Electricista Matriculado"
                                    className="pl-9"
                                    value={formData.certification}
                                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="license">Nº de Matrícula / Licencia</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="license"
                                    placeholder="Opcional"
                                    className="pl-9"
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Habilidades / Etiquetas (Max 5)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Ej. Plomería, Gas, Urgencias"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Array.isArray(formData.tags) && formData.tags.map((tag: string, i: number) => (
                                <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience">Experiencia y Servicios</Label>
                        <Textarea
                            id="experience"
                            placeholder="Describe tu experiencia, tipos de trabajos que realizas, marcas con las que trabajas..."
                            className="min-h-[100px]"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Portafolio de Trabajos</CardTitle>
                    <CardDescription>
                        Sube fotos de tus mejores trabajos para atraer clientes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.isArray(formData.portfolioImages) && formData.portfolioImages.map((img: string, i: number) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                                <img src={img} alt={`Portafolio ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <div
                            className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => document.getElementById('portfolio-upload')?.click()}
                        >
                            {isUploading ? (
                                <span className="text-sm text-muted-foreground animate-pulse">Subiendo...</span>
                            ) : (
                                <>
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground font-medium">Agregar Foto</span>
                                </>
                            )}
                            <input
                                id="portfolio-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePortfolioUpload}
                                disabled={isUploading}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading} size="lg">
                    {isLoading ? "Guardando..." : "Guardar Perfil Profesional"}
                </Button>
            </div>
        </div>
    )
}
