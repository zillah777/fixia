import prisma from "@/lib/prisma";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TestPushForm } from "./test-push-form";

export const dynamic = 'force-dynamic';

export default async function TestPushPage() {
    // Fetch users who have subscriptions
    const usersWithSubs = await prisma.user.findMany({
        where: {
            pushSubscriptions: {
                some: {}
            }
        },
        include: {
            pushSubscriptions: true
        }
    });

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Panel de Prueba de Notificaciones</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios Suscritos ({usersWithSubs.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {usersWithSubs.length === 0 ? (
                            <p className="text-muted-foreground">No hay usuarios suscritos aún. Activa las notificaciones en tu dispositivo primero.</p>
                        ) : (
                            <div className="space-y-4">
                                {usersWithSubs.map(user => (
                                    <div key={user.id} className="border p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">{user.name || 'Usuario sin nombre'}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {user.pushSubscriptions.length} dispositivo(s) conectado(s)
                                            </p>
                                        </div>
                                        <TestPushForm userId={user.id} userName={user.name || 'Usuario'} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
