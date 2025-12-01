"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, User as UserIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users")
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data)
                }
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Cargando usuarios...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">Administra clientes y profesionales de la plataforma.</p>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Actividad</TableHead>
                            <TableHead>Registro</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.role === "ADMIN" ? (
                                        <Badge variant="default" className="bg-purple-600">Admin</Badge>
                                    ) : user.role === "PROFESSIONAL" ? (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Profesional</Badge>
                                    ) : (
                                        <Badge variant="outline">Cliente</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"} className={user.status === "ACTIVE" ? "bg-green-600" : ""}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {user.role === "PROFESSIONAL"
                                            ? `${user._count.matchesAsProvider} Trabajos`
                                            : `${user._count.requests} Solicitudes`
                                        }
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem>Ver Perfil Completo</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">Bloquear Usuario</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
