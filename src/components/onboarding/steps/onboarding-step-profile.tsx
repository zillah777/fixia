"use client"

import { useState } from "react"
import Image from "next/image"
import { User } from "@prisma/client"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface OnboardingStepProfileProps {
    user: User
    onError: (error: string) => void
}

export function OnboardingStepProfile({ user, onError }: OnboardingStepProfileProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: "",
        avatar: (user as any).avatar || (user as any).image || "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        try {
            const formDataObj = new FormData()
            formDataObj.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataObj,
            })

            if (!res.ok) throw new Error("Error al subir imagen")

            const data = await res.json()
            setFormData((prev) => ({ ...prev, avatar: data.url }))
        } catch (err) {
            onError(err instanceof Error ? err.message : "Error al subir imagen")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Error al actualizar perfil")

            onError("")
        } catch (err) {
            onError(err instanceof Error ? err.message : "Error desconocido")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-3">
                <Label>Foto de Perfil</Label>
                <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-border/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {formData.avatar ? (
                            <Image
                                src={formData.avatar}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="text-muted-foreground text-3xl">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isLoading}
                                className="hidden"
                            />
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 hover:bg-muted transition-colors">
                                <Upload className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {isLoading ? "Subiendo..." : "Subir foto"}
                                </span>
                            </div>
                        </label>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG o WebP. Máximo 2MB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                    Este es el nombre que verán los clientes.
                </p>
            </div>

            {/* Phone */}
            <div className="space-y-3">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+54 9 11 2345 6789"
                    disabled={isLoading}
                />
            </div>

            {/* Location */}
            <div className="space-y-3">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ciudad, Provincia"
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                    Ayuda a los clientes a encontrarte en su zona.
                </p>
            </div>

            {/* Bio (Professionals) */}
            {user.role === "PROFESSIONAL" && (
                <div className="space-y-3">
                    <Label htmlFor="bio">Sobre ti</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
                        disabled={isLoading}
                        className="h-24"
                    />
                    <p className="text-xs text-muted-foreground">
                        Máximo 500 caracteres. Esto aparecerá en tu perfil público.
                    </p>
                </div>
            )}

            {/* Submission Info */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">ℹ️</span> Puedes completar estas secciones ahora o más tarde desde tu perfil. Los campos marcados con * son obligatorios.
                </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    "Guardar Perfil"
                )}
            </Button>
        </form>
    )
}
