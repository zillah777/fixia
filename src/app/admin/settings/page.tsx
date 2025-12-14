import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configuración</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Las opciones de configuración del sistema estarán disponibles próximamente.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
