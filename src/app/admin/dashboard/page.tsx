import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Users, FileCheck, AlertTriangle } from "lucide-react"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // Determine metrics
    const pendingVerifications = await prisma.verificationRequest.count({
        where: { status: "PENDING" }
    })

    const totalUsers = await prisma.user.count()
    const verifiedPros = await prisma.user.count({
        where: {
            role: "PROFESSIONAL",
            // Check via profile badges technically, or joined relation.
            // Simplified:
            profile: {
                badges: {
                    contains: "VERIFIED"
                }
            }
        }
    })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verificaciones Pendientes</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingVerifications}</div>
                        <p className="text-xs text-muted-foreground">Requieren revisión</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profesionales Verificados</CardTitle>
                        <FileCheck className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{verifiedPros}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
