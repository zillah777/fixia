"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function PortfolioPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [portfolioImages, setPortfolioImages] = useState<string[]>(["", "", ""])
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user && user.role !== 'PROFESSIONAL') {
            router.push('/dashboard')
        }
        fetchPortfolio()
    }, [user, router])

    const fetchPortfolio = async () => {
        try {
            const res = await fetch("/api/users/profile")
            if (res.ok) {
                const data = await res.json()
                if (data.portfolioImages && Array.isArray(data.portfolioImages)) {
                    // Ensure we always have 3 slots
                    const images = [...data.portfolioImages, "", "", ""].slice(0, 3)
                    setPortfolioImages(images)
                }
            }
        } catch (error) {
            console.error("Failed to fetch portfolio", error)
        } finally {
            setLoading(false)
        }
    }

    const uploadFile = async (file: File, index: number) => {
        setUploadingIndex(index)

        try {
            // 1. Get signature
            const sigRes = await fetch('/api/upload/cloudinary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uploadType: 'portfolio' })
            })
            const sigData = await sigRes.json()
            if (!sigRes.ok) throw new Error(sigData.error)

            // 2. Upload to Cloudinary
            const formData = new FormData()
            formData.append('file', file)
            formData.append('api_key', sigData.apiKey)
            formData.append('timestamp', sigData.timestamp.toString())
            formData.append('signature', sigData.signature)
            formData.append('folder', sigData.folder)

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            })
            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload failed')

            // 3. Update portfolio images in database
            const newImages = [...portfolioImages]
            newImages[index] = uploadData.secure_url

            const updateRes = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioImages: newImages.filter(img => img !== "") })
            })

            if (!updateRes.ok) throw new Error('Failed to update profile')

            setPortfolioImages(newImages)
            toast.success("Imagen agregada al portafolio")
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Error al subir imagen")
        } finally {
            setUploadingIndex(null)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Por favor selecciona una imagen")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("La imagen no debe superar 5MB")
            return
        }

        uploadFile(file, index)
    }

    const handleRemoveImage = async (index: number) => {
        try {
            const newImages = [...portfolioImages]
            newImages[index] = ""

            const updateRes = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioImages: newImages.filter(img => img !== "") })
            })

            if (!updateRes.ok) throw new Error('Failed to update profile')

            setPortfolioImages(newImages)
            toast.success("Imagen eliminada")
        } catch (error) {
            toast.error("Error al eliminar imagen")
        }
    }

    if (!user || user.role !== 'PROFESSIONAL') {
        return null
    }

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mi Portafolio</h2>
                <p className="text-muted-foreground">
                    Sube hasta 3 imágenes de tus trabajos anteriores. Estas se mostrarán en tu perfil público.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {portfolioImages.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-square bg-muted">
                                    {uploadingIndex === index ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : image ? (
                                        <>
                                            <img
                                                src={image}
                                                alt={`Trabajo ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                                            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Subir imagen {index + 1}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Máx. 5MB
                                            </p>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, index)}
                                                disabled={uploadingIndex !== null}
                                            />
                                        </label>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Consejos para mejores resultados</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Usa imágenes de alta calidad que muestren claramente tu trabajo</li>
                            <li>• Asegúrate de que las fotos estén bien iluminadas</li>
                            <li>• Muestra el antes y después si es posible</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
