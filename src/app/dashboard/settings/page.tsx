"use client"

import { useState } from "react"
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
import { Camera, Save, Facebook, Instagram, Twitter } from "lucide-react"
import { toast } from "sonner"
import { VerificationRequestForm } from "@/components/trust/verification-request-form"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        instagram: "",
        facebook: "",
        twitter: "",
        tiktok: ""
    })

    // Fetch initial data
    useState(() => {
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
                }
            } catch (error) {
                console.error("Failed to fetch profile", error)
            }
        }
        fetchProfile()
    })

    const [passwords, setPasswords] = useState({
        current: "",
        new: ""
    })

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
                })
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
                <TabsList>
                    <TabsTrigger value="profile">Perfil Público</TabsTrigger>
                    <TabsTrigger value="account">Cuenta</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                    <TabsTrigger value="verification">Verificación</TabsTrigger>
                </TabsList>

                <TabsContent value="verification" className="space-y-4">
                    <VerificationRequestForm />
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Perfil</CardTitle>
                            <CardDescription>
                                Así es como te verán otros usuarios en la plataforma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Foto de Perfil</h4>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, GIF o PNG. Máximo 2MB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Tu nombre"
                                    />
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
                                <div className="grid gap-4 md:grid-cols-2">
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

                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                            <CardDescription className="text-red-600/80">
                                Acciones irreversibles para tu cuenta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Eliminar Cuenta</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencias de Notificación</CardTitle>
                            <CardDescription>
                                Elige qué notificaciones quieres recibir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-messages" className="flex flex-col space-y-1">
                                    <span>Mensajes Nuevos</span>
                                    <span className="font-normal text-xs text-muted-foreground">Recibe alertas cuando te envíen un mensaje.</span>
                                </Label>
                                <Switch id="new-messages" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="proposals" className="flex flex-col space-y-1">
                                    <span>Nuevas Propuestas</span>
                                    <span className="font-normal text-xs text-muted-foreground">Alertas sobre nuevas ofertas en tus solicitudes.</span>
                                </Label>
                                <Switch id="proposals" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                    <span>Correos de Marketing</span>
                                    <span className="font-normal text-xs text-muted-foreground">Recibe noticias y promociones de Fixia.</span>
                                </Label>
                                <Switch id="marketing" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
