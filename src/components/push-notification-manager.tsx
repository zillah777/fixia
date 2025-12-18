"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { VAPID_PUBLIC_KEY } from "@/lib/web-push-keys";

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
    const { user } = useAuth();
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isDismissed, setIsDismissed] = useState(true); // Default to true to avoid flash

    const saveSubscription = useCallback(async (sub: PushSubscription) => {
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
    }, []);

    const registerServiceWorker = useCallback(async () => {
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
    }, [saveSubscription]);

    useEffect(() => {
        // Check if dismissed in localStorage
        const dismissed = localStorage.getItem('push_notification_dismissed');
        setIsDismissed(dismissed === 'true');

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, [registerServiceWorker]);

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

    function handleDismiss() {
        setIsDismissed(true);
        localStorage.setItem('push_notification_dismissed', 'true');
    }

    // Conditions to NOT show the button:
    // 1. Not supported by browser
    // 2. User not logged in
    // 3. Already subscribed
    // 4. User dismissed the prompt
    if (!isSupported || !user || subscription || isDismissed) {
        return null;
    }

    return (
        <div className="fixed bottom-20 right-4 z-40 md:bottom-4 md:right-auto md:left-4 flex items-center gap-2">
            <Button
                onClick={subscribeToPush}
                className="bg-stone-900 hover:bg-stone-800 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium"
            >
                <Bell className="h-4 w-4" />
                Activar Notificaciones
            </Button>
            <Button
                onClick={handleDismiss}
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg bg-white hover:bg-gray-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
            </Button>
        </div>
    );
}
