import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function VerificationDetailPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params

    const verification = await prisma.verificationRequest.findUnique({
        where: { userId },
        include: { user: true }
    })

    if (!verification) return notFound()

    async function handleApprove() {
        "use server"

        if (!verification) {
            redirect("/admin/verifications")
        }

        // Transaction: Approve Request + Add Badges + Notify
        await prisma.$transaction(async (tx) => {
            // 1. Update Request
            await tx.verificationRequest.update({
                where: { id: verification.id },
                data: { status: "APPROVED" }
            })

            // 2. Update User Profile Badges
            // Use raw JSON manipulation or fetch-update logic.
            // Simplest: Fetch profile, parse badges, add unique, update.
            const profile = await tx.profile.findUnique({ where: { userId } })
            if (profile) {
                let badges: string[] = []
                try {
                    badges = JSON.parse(profile.badges)
                } catch (e) { console.error(e) }

                if (!badges.includes("VERIFIED")) badges.push("VERIFIED")

                // If Professional and has Cert, add CERTIFIED
                if (verification.user.role === "PROFESSIONAL" && verification.certificationUrl) {
                    if (!badges.includes("CERTIFIED")) badges.push("CERTIFIED")
                }

                await tx.profile.update({
                    where: { userId },
                    data: { badges: JSON.stringify(badges) }
                })
            }

            // 3. Notification
            await tx.notification.create({
                data: {
                    userId,
                    type: "SYSTEM",
                    message: "¡Tu identidad ha sido verificada exitosamente!",
                    actionUrl: "/dashboard/profile"
                }
            })
        })

        redirect("/admin/verifications")
    }

    async function handleReject() {
        "use server"
        if (!verification) {
            redirect("/admin/verifications")
        }
        await prisma.verificationRequest.update({
            where: { id: verification.id },
            data: { status: "REJECTED" }
        })
        // Notify Rejection
        await prisma.notification.create({
            data: {
                userId,
                type: "SYSTEM",
                message: "Tu solicitud de verificación ha sido rechazada. Por favor revisa los documentos.",
                actionUrl: "/dashboard/verification"
            }
        })
        redirect("/admin/verifications")
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/verifications">
                    <Button variant="ghost" size="icon"><ArrowLeft /></Button>
                </Link>
                <h1 className="text-2xl font-bold">Revisar Verificación</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Datos del Usuario</span>
                        <Badge>{verification.user.role}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Nombre</div>
                        <div>{verification.user.name}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div>{verification.user.email}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">DNI</div>
                        <div>{verification.user.dni || "No registrado"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                        <div>{verification.user.phone || "No registrado"}</div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-lg font-bold mt-8">Documentación</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="font-medium">DNI Frente</h3>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                        <Image src={verification.idFront} alt="DNI Frente" fill className="object-contain" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-medium">DNI Dorso</h3>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                        <Image src={verification.idBack} alt="DNI Dorso" fill className="object-contain" />
                    </div>
                </div>
            </div>

            {verification.user.role === "PROFESSIONAL" && (
                <div className="mt-8">
                    <h2 className="text-lg font-bold mb-4">Certificación Profesional</h2>
                    {verification.certificationUrl ? (
                        <div className="p-4 border rounded-lg bg-blue-50 flex items-center gap-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div className="flex-1">
                                <p className="font-medium text-blue-900">Documento de Certificación</p>
                                <a
                                    href={verification.certificationUrl}
                                    target="_blank"
                                    className="text-sm text-blue-700 underline hover:text-blue-900"
                                >
                                    Ver documento completo
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 border rounded-lg bg-gray-100 text-gray-500 italic">
                            No se adjuntó certificación.
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4 pt-8 border-t mt-8">
                <form action={handleReject}>
                    <Button variant="destructive" className="gap-2">
                        <XCircle className="h-4 w-4" /> Rechazar
                    </Button>
                </form>
                <form action={handleApprove} className="ml-auto">
                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="h-4 w-4" /> Aprobar y Verificar
                    </Button>
                </form>
            </div>
        </div>
    )
}
