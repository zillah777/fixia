"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";

const VAPID_PUBLIC_KEY = 'BAe4hkL2QSfUlgegiIkitfH5L8tEFMBxe4KZTUA231yXmiaapWzAjHlFOVJNIbCUS1eq5-WSoUSB66Y09ubefto';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushSubscriptionButton() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        }
    }, []);

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
        } catch (e) {
            console.error("Error checking subscription", e);
        }
    }

    async function saveSubscription(sub: PushSubscription) {
        try {
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sub),
            });
        } catch (error) {
            console.error('Failed to save subscription:', error);
        }
    }

    async function subscribeToPush() {
        setLoading(true);
        try {
            if (Notification.permission === 'denied') {
                throw new Error("Permiso de notificaciones denegado. Habilítalas en la configuración del navegador.");
            }

            // Explicitly register SW to ensure it exists
            const reg = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            setSubscription(sub);
            await saveSubscription(sub);
            toast.success("¡Dispositivo conectado exitosamente!");
        } catch (error: any) {
            console.error('Failed to subscribe:', error);

            let errorMessage = "Error al activar notificaciones.";
            let detailedError = error instanceof Error ? error.message : String(error);

            if (detailedError.includes('permission denied') || detailedError.includes('Permission denied')) {
                errorMessage = "Permiso denegado.";
                alert("No se pudo activar las notificaciones:\n\n1. ¿Estás en Modo Incógnito? (No soportado por Chrome)\n2. ¿Bloqueaste las notificaciones anteriormente?\n\nRevisa el candado 🔒 en la barra de dirección.");
            } else {
                alert(`Error: ${detailedError}`);
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (!isSupported) {
        if (typeof window !== 'undefined' && !window.isSecureContext) {
            return (
                <div className="text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900">
                    <p className="font-bold">⚠️ Conexión no segura</p>
                    <p>Las notificaciones push requieren una conexión segura (HTTPS) o localhost.</p>
                    <p className="mt-1 text-xs">Si estás probando en red local, intenta usar <code>localhost</code> en la PC o configura HTTPS.</p>
                </div>
            );
        }
        return <p className="text-sm text-muted-foreground">Tu navegador no soporta notificaciones push.</p>;
    }

    if (subscription) {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md border border-green-200 dark:border-green-900">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Este dispositivo está conectado y recibiendo notificaciones.</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Button onClick={subscribeToPush} disabled={loading} className="w-full sm:w-auto">
                <Bell className="mr-2 h-4 w-4" />
                {loading ? "Conectando..." : "Activar notificaciones en este dispositivo"}
            </Button>
            <p className="text-xs text-muted-foreground">
                Te pediremos permiso para mostrar notificaciones.
            </p>
        </div>
    );
}
