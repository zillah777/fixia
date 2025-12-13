'use client'

import dynamic from 'next/dynamic';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { TickerLED } from "@/components/ticker-led";
import { AuthProvider } from "@/providers/auth-provider";
import { CookieBanner } from "@/components/cookie-banner";
import GoogleAnalytics from "@/components/google-analytics";
import { Suspense } from "react";

const ThemeProvider = dynamic(() => import("@/components/theme-provider").then(mod => ({ default: mod.ThemeProvider })), {
    ssr: false,
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
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
                            <Toaster position="top-center" richColors />
                        </TooltipProvider>
                        <CookieBanner />
                    </AuthProvider>
                </ThemeProvider>
            </Suspense>
        </>
    );
}
