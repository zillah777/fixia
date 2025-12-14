'use client'

import dynamic from 'next/dynamic';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { TickerLED } from "@/components/ticker-led";
import { AuthProvider } from "@/providers/auth-provider";
import { CookieBanner } from "@/components/cookie-banner";
import GoogleAnalytics from "@/components/google-analytics";
import { Suspense, useEffect } from "react";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PushNotificationManager } from "@/components/push-notification-manager";

const ThemeProvider = dynamic(() => import("@/components/theme-provider").then(mod => ({ default: mod.ThemeProvider })), {
    ssr: false,
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
    // Service Worker registration is handled inside PushNotificationManager now, 
    // but we can keep the global one or remove it. 
    // To avoid conflicts, let's remove the duplicate useEffect here and let PushNotificationManager handle it,
    // OR keep it simple and just add the component.
    // Since PushNotificationManager handles registration logic too, we can remove the useEffect here to be cleaner.

    return (
        <>
            {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            )}
            <Suspense fallback={null}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <TooltipProvider>
                            <TickerLED />
                            {children}
                            <InstallPrompt />
                            <PushNotificationManager />
                            <Toaster position="top-center" richColors />
                        </TooltipProvider>
                        <CookieBanner />
                    </AuthProvider>
                </ThemeProvider>
            </Suspense>
        </>
    );
}
