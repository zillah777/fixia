"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin, Upload } from "lucide-react"
import { toast } from "sonner"

// Mock user data
const userData = {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "PROFESSIONAL",
    image: "/placeholder-user.jpg",
    bio: "Electricista matriculado con más de 10 años de experiencia en instalaciones residenciales y comerciales.",
    location: "Palermo, CABA",
    phone: "+54 9 11 1234 5678",
    certifications: ["Matrícula Nacional #12345", "Curso de Seguridad Eléctrica"],
    subscription: {
        plan: "PROFESSIONAL",
        status: "ACTIVE",
        nextBilling: "15/12/2024"
    }
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(userData)

    const handleSave = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock random error for demonstration (remove in prod)
            // if (Math.random() > 0.8) throw new Error("Error de conexión");

            toast.success("Perfil actualizado correctamente")
            setIsEditing(false)
        } catch (error) {
            toast.error("Error al actualizar perfil", {
                description: "No se pudieron guardar los cambios. Intenta nuevamente."
            })
        }
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
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={formData.image} />
                                    <AvatarFallback>{formData.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            <h3 className="text-xl font-bold">{formData.name}</h3>
                            <p className="text-sm text-muted-foreground">{formData.email}</p>
                            <div className="mt-2 flex gap-2 justify-center">
                                <Badge variant="outline">{formData.role}</Badge>
                                {formData.subscription.status === "ACTIVE" && (
                                    <Badge className="bg-green-500 hover:bg-green-600">Verificado</Badge>
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
                                <span className="text-green-600 font-medium">{formData.subscription.status}</span>
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
                                        value={formData.name}
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
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía / Experiencia</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    value={formData.bio}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Certificaciones</Label>
                                <div className="space-y-2">
                                    {formData.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                            <span>{cert}</span>
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <Button variant="outline" size="sm" className="w-full border-dashed">
                                            + Agregar Certificación
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
