"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Info, Camera, Save, Facebook, Instagram, Twitter, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VerificationRequestForm } from "@/components/trust/verification-request-form"
import { CertificationRequestForm } from "@/components/trust/certification-request-form"
import { ProfessionalProfileForm } from "@/components/settings/professional-profile-form"
import { PushSubscriptionButton } from "@/components/settings/push-subscription-button"
import { PWAInstallGuide } from "@/components/pwa/pwa-install-guide"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { user, refreshUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        instagram: "",
        facebook: "",
        twitter: "",
        tiktok: ""
    })

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen no puede superar los 2MB")
            return
        }

        setIsUploading(true)
        const toastId = toast.loading("Subiendo imagen...")

        try {
            // 1. Get signed token
            const tokenRes = await fetch("/api/upload/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadType: "profile" }),
                credentials: "include"
            })

            if (!tokenRes.ok) throw new Error("Error obteniendo token de subida")
            const { signature, timestamp, folder, cloudName, apiKey, uploadUrl } = await tokenRes.json()

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

            if (!uploadRes.ok) throw new Error("Error subiendo imagen a Cloudinary")
            const uploadData = await uploadRes.json()

            // 3. Update Profile with new Avatar URL
            const updateRes = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    avatar: uploadData.secure_url
                }),
                credentials: "include"
            })

            if (!updateRes.ok) throw new Error("Error actualizando perfil")

            // 4. Refresh user session
            await refreshUser()

            toast.success("Foto de perfil actualizada", { id: toastId })
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Error al actualizar la foto de perfil", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    const handleDeleteAvatar = async () => {
        setIsUploading(true)
        const toastId = toast.loading("Eliminando foto...")

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    avatar: null
                }),
                credentials: "include"
            })

            if (!res.ok) throw new Error("Error eliminando foto")

            await refreshUser()
            toast.success("Foto de perfil eliminada", { id: toastId })
        } catch (error) {
            console.error("Delete error:", error)
            toast.error("Error al eliminar la foto de perfil", { id: toastId })
        } finally {
            setIsUploading(false)
        }
    }

    const [proData, setProData] = useState<any>(null)

    // Fetch initial data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/users/profile")
                if (res.ok) {
                    const data = await res.json()
                    const socialLinks = data.profile?.socialLinks ? JSON.parse(data.profile.socialLinks) : {}
                    setFormData({
                        name: data.name || "",
                        bio: data.profile?.bio || "",
                        instagram: socialLinks.instagram || "",
                        facebook: socialLinks.facebook || "",
                        twitter: socialLinks.twitter || "",
                        tiktok: socialLinks.tiktok || ""
                    })

                    if (data.role === 'PROFESSIONAL' && data.profile) {
                        // Load ALL professional data from registration and profile
                        setProData({
                            // Registration data
                            yearsExperience: data.profile.yearsExperience || "",
                            education: data.profile.education || data.profile.diploma || "",
                            bio: data.profile.bio || data.profile.description || "",
                            // Settings/Additional data
                            certification: data.profile.certification || data.profile.diploma || "",
                            licenseNumber: data.profile.licenseNumber || data.profile.professionalLicense || "",
                            experience: data.profile.experience || data.profile.experienceDetails || "",
                            tags: data.profile.tags,
                            portfolioImages: data.profile.portfolioImages
                        })
                    }

                    if (data.profile?.notificationSettings) {
                        try {
                            const prefs = JSON.parse(data.profile.notificationSettings)
                            setNotificationPreferences(prev => ({ ...prev, ...prefs }))
                        } catch (e) {
                            console.error("Error parsing notification settings", e)
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error)
            }
        }
        fetchProfile()
    }, [])

    const [passwords, setPasswords] = useState({
        current: "",
        new: ""
    })

    const router = useRouter()

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/delete", {
                method: "DELETE"
            })

            if (!res.ok) throw new Error("Failed to delete account")

            toast.success("Cuenta eliminada exitosamente")
            // Redirect to home after a short delay
            setTimeout(() => {
                router.push("/")
            }, 1500)
        } catch (error) {
            toast.error("Error al eliminar la cuenta")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const socialLinks = {
                instagram: formData.instagram,
                facebook: formData.facebook,
                twitter: formData.twitter,
                tiktok: formData.tiktok
            }

            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    bio: formData.bio,
                    socialLinks
                }),
                credentials: "include"
            })

            if (!res.ok) throw new Error("Failed to update")

            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            toast.error("Error al guardar cambios")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordUpdate = async () => {
        if (!passwords.current || !passwords.new) {
            toast.error("Completa todos los campos")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/auth/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to update password")
            }

            toast.success("Contraseña actualizada")
            setPasswords({ current: "", new: "" })
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const [notificationPreferences, setNotificationPreferences] = useState({
        newMessages: true,
        proposals: true,
        marketing: false
    })

    const handleNotificationChange = async (key: string, value: boolean) => {
        const newPreferences = { ...notificationPreferences, [key]: value }
        setNotificationPreferences(newPreferences)

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notificationSettings: newPreferences
                }),
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to update preferences")
            toast.success("Preferencias actualizadas")
        } catch (error) {
            toast.error("Error al guardar preferencias")
            // Revert on error
            setNotificationPreferences({ ...notificationPreferences })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                    Administra tu cuenta, perfil y preferencias.
                </p>
            </div>
            <Separator />

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid grid-cols-2 h-auto md:flex md:flex-row md:w-full md:justify-start md:overflow-x-auto md:flex-nowrap md:max-w-full md:no-scrollbar gap-2">
                    <TabsTrigger value="profile" className="whitespace-nowrap w-full md:w-auto">Perfil Público</TabsTrigger>
                    {user?.role === 'PROFESSIONAL' && <TabsTrigger value="professional" className="whitespace-nowrap w-full md:w-auto">Profesional</TabsTrigger>}
                    <TabsTrigger value="account" className="whitespace-nowrap w-full md:w-auto">Cuenta</TabsTrigger>
                    <TabsTrigger value="notifications" className="whitespace-nowrap w-full md:w-auto">Notificaciones</TabsTrigger>
                    <TabsTrigger value="verification" className="whitespace-nowrap w-full md:w-auto">Verificación</TabsTrigger>
                    {user?.role === 'PROFESSIONAL' && <TabsTrigger value="certifications" className="whitespace-nowrap w-full md:w-auto">Certificaciones</TabsTrigger>}
                </TabsList>

                <TabsContent value="verification" className="space-y-4">
                    <VerificationRequestForm />
                </TabsContent>

                {user?.role === 'PROFESSIONAL' && (
                    <TabsContent value="certifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificaciones Profesionales</CardTitle>
                                <CardDescription>
                                    Subí títulos, diplomas o certificaciones profesionales para verificar tus credenciales.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CertificationRequestForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Perfil</CardTitle>
                            <CardDescription>
                                Así es como te verán otros usuarios en la plataforma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                <div className="relative group">
                                    <div className="cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 transition-opacity group-hover:opacity-80">
                                            <AvatarImage src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
                                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>

                                    {user?.avatar && (
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute -top-1 -right-1 rounded-full h-8 w-8 shadow-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAvatar();
                                            }}
                                            disabled={isUploading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}

                                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md pointer-events-none">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={isUploading}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Foto de Perfil</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Haz clic en la imagen para cambiarla.
                                        <br />
                                        JPG, GIF o PNG. Máximo 2MB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Tu nombre"
                                        disabled // Prevent name change
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        El nombre no se puede cambiar por seguridad.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de Usuario</Label>
                                    <Input id="username" placeholder="@usuario" disabled />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Cuéntanos un poco sobre ti..."
                                    className="min-h-[100px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Breve descripción para tu perfil público.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Label>Redes Sociales</Label>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Instagram URL"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Facebook URL"
                                            value={formData.facebook}
                                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Twitter className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Twitter URL"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-muted-foreground fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                        <Input
                                            placeholder="TikTok URL"
                                            value={formData.tiktok}
                                            onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? "Guardando..." : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cuenta</CardTitle>
                            <CardDescription>
                                Administra la configuración de tu cuenta y seguridad.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" defaultValue={user?.email || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Contraseña Actual</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handlePasswordUpdate} disabled={isLoading}>Actualizar Contraseña</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                            <CardDescription className="text-destructive/80">
                                Acciones irreversibles para tu cuenta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Eliminar Cuenta</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                                        Se eliminarán todos tus datos, incluyendo perfil, solicitudes, propuestas y mensajes.
                                    </p>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" disabled={isLoading}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar mi cuenta
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                                <AlertDialogDescription asChild>
                                                    <div>
                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                                                        y removerá todos tus datos de nuestros servidores, incluyendo:
                                                        <ul className="list-disc pl-6 mt-2 space-y-1">
                                                            <li>Tu perfil y configuración</li>
                                                            <li>Todas tus solicitudes de servicio</li>
                                                            <li>Propuestas enviadas o recibidas</li>
                                                            <li>Historial de mensajes</li>
                                                            <li>Portafolio y reseñas</li>
                                                        </ul>
                                                    </div>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeleteAccount}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Sí, eliminar mi cuenta
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {user?.role === 'PROFESSIONAL' && (
                    <TabsContent value="professional">
                        <ProfessionalProfileForm
                            initialData={proData}
                            onSave={async (data) => {
                                try {
                                    const res = await fetch("/api/users/profile", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(data),
                                        credentials: "include"
                                    })
                                    if (!res.ok) throw new Error("Update failed")
                                    toast.success("Perfil profesional actualizado")
                                    refreshUser()
                                } catch (e) {
                                    toast.error("Error al guardar")
                                }
                            }}
                        />
                    </TabsContent>
                )}

                <TabsContent value="notifications" className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            Si quieres recibir notificaciones instala la App como indica las instrucciones y luego activa notificaciones PUSH en &quot;Notificaciones&quot;
                        </AlertDescription>
                    </Alert>
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencias de Notificación</CardTitle>
                            <CardDescription>
                                Elige qué notificaciones quieres recibir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                                <Label htmlFor="new-messages" className="flex flex-col space-y-1">
                                    <span>Mensajes Nuevos</span>
                                    <span className="font-normal text-xs text-muted-foreground">Recibe alertas cuando te envíen un mensaje.</span>
                                </Label>
                                <Switch
                                    id="new-messages"
                                    checked={notificationPreferences.newMessages}
                                    onCheckedChange={(checked) => handleNotificationChange("newMessages", checked)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                                <Label htmlFor="proposals" className="flex flex-col space-y-1">
                                    <span>Nuevas Propuestas</span>
                                    <span className="font-normal text-xs text-muted-foreground">Alertas sobre nuevas ofertas en tus solicitudes.</span>
                                </Label>
                                <Switch
                                    id="proposals"
                                    checked={notificationPreferences.proposals}
                                    onCheckedChange={(checked) => handleNotificationChange("proposals", checked)}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                    <span>Correos de Marketing</span>
                                    <span className="font-normal text-xs text-muted-foreground">Recibe noticias y promociones de Fixia.</span>
                                </Label>
                                <Switch
                                    onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notificaciones Push</CardTitle>
                            <CardDescription>
                                Gestiona la conexión de este dispositivo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <PushSubscriptionButton />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>¿No sabes cómo instalar la App?</span>
                                <PWAInstallGuide trigger={
                                    <Button variant="link" className="h-auto p-0 text-xs">Ver instrucciones</Button>
                                } />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
