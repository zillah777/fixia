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
import { MoreHorizontal, Shield, User as UserIcon, AlertTriangle, Trash2, Ban, CheckCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleUserStatus, deleteUser } from "./actions"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)

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

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        try {
            const result = await toggleUserStatus(userId, currentStatus)
            if (result.success) {
                toast.success(`Usuario ${result.newStatus === 'ACTIVE' ? 'activado' : 'suspendido'} exitosamente`)
                // Optimistic update
                setUsers(users.map(u => u.id === userId ? { ...u, status: result.newStatus } : u))
            }
        } catch (error) {
            toast.error("Error al actualizar estado")
        }
    }

    const handleDelete = async () => {
        if (!userToDelete) return
        try {
            const result = await deleteUser(userToDelete)
            if (result.success) {
                toast.success("Usuario eliminado exitosamente")
                setUsers(users.filter(u => u.id !== userToDelete))
            } else {
                toast.error("No se pudo eliminar al usuario")
            }
        } catch (error) {
            toast.error("Error al eliminar usuario")
        } finally {
            setUserToDelete(null)
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Cargando usuarios...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">Administra clientes y profesionales de la plataforma.</p>
            </div>

            <div className="border rounded-md bg-white dark:bg-card">
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
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Profesional</Badge>
                                    ) : (
                                        <Badge variant="outline">Cliente</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.status === "ACTIVE" ? "default" : "destructive"}
                                        className={user.status === "ACTIVE" ? "bg-green-600 hover:bg-green-700" : ""}
                                    >
                                        {user.status === "ACTIVE" ? "Activo" : "Suspendido"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-muted-foreground">
                                        {user.role === "PROFESSIONAL"
                                            ? `${user._count?.matchesAsProvider || 0} Trabajos`
                                            : `${user._count?.requests || 0} Solicitudes`
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
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

                                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status)}>
                                                {user.status === "ACTIVE" ? (
                                                    <>
                                                        <Ban className="mr-2 h-4 w-4 text-orange-500" />
                                                        <span>Suspender Cuenta</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                        <span>Activar Cuenta</span>
                                                    </>
                                                )}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                                                onClick={() => setUserToDelete(user.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Eliminar Usuario</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta del usuario
                            y eliminará sus datos de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar Cuenta
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
