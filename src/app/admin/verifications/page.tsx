import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Check, X, Eye } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminVerificationsPage() {
    const verifications = await prisma.verificationRequest.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Verificaciones Pendientes</h1>

            <div className="grid gap-4">
                {verifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No hay verificaciones pendientes.
                        </CardContent>
                    </Card>
                ) : (
                    verifications.map((v) => (
                        <Card key={v.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{v.user.name}</h3>
                                        <Badge variant={v.user.role === 'PROFESSIONAL' ? "default" : "secondary"}>
                                            {v.user.role}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{v.user.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Solicitado el: {new Date(v.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link href={`/admin/verifications/${v.userId}`}>
                                        <Button variant="outline">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Revisar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
