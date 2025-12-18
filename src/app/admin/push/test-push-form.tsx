"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function TestPushForm({ userId, userName }: { userId: string, userName: string }) {
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/push/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    title: `Hola ${userName}`,
                    body: '¡Esta es una notificación de prueba desde el panel de control!',
                    url: '/dashboard'
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`Enviado a ${data.sent} dispositivo(s)`);
            } else {
                toast.error(data.error || 'Error al enviar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleSend} disabled={loading} size="sm">
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Enviando...' : 'Probar'}
        </Button>
    );
}
