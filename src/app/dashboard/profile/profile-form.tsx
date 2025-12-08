"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { TagInput } from "@/components/ui/tag-input"

interface ProfileFormProps {
    user: {
        name: string | null | undefined;
        email: string;
        role: string;
        avatar?: string | null;
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState<any>({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "CLIENT",
        image: user.avatar || "",
        bio: "",
        location: "",
        phone: "",
        certification: "",
        licenseNumber: "",
        experience: "",
        tags: [],
        subscription: {
            plan: "FREE",
            status: "INACTIVE",
            nextBilling: "-"
        }
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/users/profile")
            if (res.ok) {
                const data = await res.json()
                const profile = data.profile || {}

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    role: data.role || "CLIENT",
                    image: data.avatar || profile.portfolioImages?.[0] || "",
                    bio: profile.bio || "",
                    location: "",
                    phone: data.phone || "",
                    certification: profile.certification || "",
                    licenseNumber: profile.licenseNumber || "",
                    experience: profile.experience || "",
                    tags: profile.tags || [],
                    subscription: {
                        plan: data.subscriptionPlan || "FREE",
                        status: data.subscriptionStatus || "INACTIVE",
                        nextBilling: data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt).toLocaleDateString() : "-"
                    }
                })
            }
        } catch (error) {
            console.error("Failed to fetch profile", error)
            toast.error("Error al cargar perfil")
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("La imagen no debe superar los 5MB")
            return
        }

        setUploading(true)
        const toastId = toast.loading("Subiendo imagen...")

        try {
            const tokenRes = await fetch("/api/upload/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadType: "profile" })
            })

            if (!tokenRes.ok) throw new Error("Error obteniendo permisos de subida")
            const tokenData = await tokenRes.json()

            const formDataVal = new FormData()
            formDataVal.append("file", file)
            formDataVal.append("api_key", tokenData.apiKey)
            formDataVal.append("timestamp", tokenData.timestamp.toString())
            formDataVal.append("signature", tokenData.signature)
            formDataVal.append("folder", tokenData.folder)
            if (tokenData.tags) formDataVal.append("tags", tokenData.tags)

            const uploadRes = await fetch(tokenData.uploadUrl, {
                method: "POST",
                body: formDataVal
            })

            if (!uploadRes.ok) throw new Error("Error al subir imagen a la nube")
            const uploadData = await uploadRes.json()

            const updateRes = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar: uploadData.secure_url })
            })

            if (!updateRes.ok) throw new Error("Error actualizando perfil")

            toast.success("Avatar actualizado", { id: toastId })
            window.location.reload()

        } catch (error) {
            console.error(error)
            toast.error("Error al subir avatar, intenta nuevamente", { id: toastId })
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    bio: formData.bio,
                    certification: formData.certification,
                    licenseNumber: formData.licenseNumber,
                    experience: formData.experience,
                    tags: formData.tags,
                    // location: formData.location // Not supported by backend yet
                })
            })

            if (!res.ok) throw new Error("Failed to update")

            toast.success("Perfil actualizado correctamente")
            setIsEditing(false)
        } catch (error) {
            toast.error("Error al actualizar perfil", {
                description: "No se pudieron guardar los cambios. Intenta nuevamente."
            })
        }
    }

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
                <p className="text-muted-foreground">Administra tu información personal y profesional.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <div className="relative mb-4 group">
                                <Avatar className="h-24 w-24 border-2 border-border group-hover:opacity-80 transition-opacity">
                                    <AvatarImage src={formData.image} className="object-cover" />
                                    <AvatarFallback className="text-2xl">{formData.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>
                            <h3 className="text-xl font-bold mt-2">{formData.name}</h3>
                            <p className="text-sm text-muted-foreground">{formData.email}</p>
                            <div className="mt-2 flex gap-2 justify-center">
                                <Badge variant="outline">{formData.role}</Badge>
                                {formData.subscription.status === "ACTIVE" && (
                                    <Badge className="bg-accent hover:bg-accent">Verificado</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Suscripción</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Plan Actual:</span>
                                <span className="font-medium">{formData.subscription.plan}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estado:</span>
                                <span className={formData.subscription.status === "ACTIVE" ? "text-accent font-medium" : "text-muted-foreground"}>
                                    {formData.subscription.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Próximo Cobro:</span>
                                <span>{formData.subscription.nextBilling}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Gestionar Suscripción</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Main Form */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Información Personal</CardTitle>
                                <Button variant={isEditing ? "default" : "outline"} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                                    {isEditing ? "Guardar Cambios" : "Editar Perfil"}
                                </Button>
                            </div>
                            <CardDescription>
                                Esta información será visible para los clientes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        value={formData.name || ""}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        className="pl-9"
                                        value={formData.location}
                                        disabled={!isEditing} // Disabled for now as backend doesn't support it
                                        placeholder="No disponible"
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía / Presentación</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    value={formData.bio}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            {formData.role === "PROFESSIONAL" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="certification">Certificación / Título</Label>
                                            <Input
                                                id="certification"
                                                value={formData.certification}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                                placeholder="Ej. Electricista Matriculado"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="licenseNumber">Nro. Matrícula / Licencia</Label>
                                            <Input
                                                id="licenseNumber"
                                                value={formData.licenseNumber}
                                                disabled={!isEditing}
                                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                placeholder="Ej. MN-12345"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Experiencia</Label>
                                        <Input
                                            id="experience"
                                            value={formData.experience}
                                            disabled={!isEditing}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            placeholder="Ej. 10 años en el rubro"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tags de Expertise (Máx. 5)</Label>
                                        <TagInput
                                            value={formData.tags}
                                            onChange={(tags) => setFormData({ ...formData, tags })}
                                            disabled={!isEditing}
                                            placeholder="Escribe una habilidad y presiona Enter..."
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Palabras clave que describen tus habilidades (ej. "Electricidad", "Plomería", "Urgencias").
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
