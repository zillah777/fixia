"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
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

export function TestSubscribeButton() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        }
    }, []);

    async function checkSubscription() {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
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
        try {
            // Explicitly register SW to ensure it exists
            const reg = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            setSubscription(sub);
            await saveSubscription(sub);
            toast.success("¡Suscrito correctamente!");
            window.location.reload(); // Reload to show user in the list
        } catch (error) {
            console.error('Failed to subscribe:', error);
            // Show detailed error in alert since we can't see console
            alert(`Error al suscribirse: ${error instanceof Error ? error.message : String(error)}`);
            toast.error("Error al suscribirse. Revisa la consola.");
        }
    }

    if (!isSupported) return <p className="text-sm text-red-500">Tu navegador no soporta notificaciones push.</p>;

    if (subscription) return <p className="text-sm text-green-600 font-medium">✅ Este dispositivo ya está suscrito.</p>;

    return (
        <Button onClick={subscribeToPush} className="w-full sm:w-auto">
            <Bell className="mr-2 h-4 w-4" />
            Suscribir este dispositivo
        </Button>
    );
}
