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

export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });

            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);

            if (sub) {
                // Ensure backend has the latest subscription
                await saveSubscription(sub);
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
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
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            setSubscription(sub);
            await saveSubscription(sub);
            toast.success("¡Notificaciones activadas!");
        } catch (error) {
            console.error('Failed to subscribe:', error);
            toast.error("No pudimos activar las notificaciones. Verifica los permisos.");
        }
    }

    if (!isSupported) {
        return null;
    }

    // Only show if not subscribed.
    // We can also make this a settings toggle later.
    if (subscription) {
        return null;
    }

    return (
        <div className="fixed bottom-20 right-4 z-40 md:bottom-4 md:right-auto md:left-4">
            <Button
                onClick={subscribeToPush}
                className="bg-stone-900 hover:bg-stone-800 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium"
            >
                <Bell className="h-4 w-4" />
                Activar Notificaciones
            </Button>
        </div>
    );
}
