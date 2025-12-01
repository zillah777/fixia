import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TickerLED } from "@/components/ticker-led";
import { AuthProvider } from "@/providers/auth-provider";

import GoogleAnalytics from "@/components/google-analytics";

export const metadata: Metadata = {
    title: "Fixia - Servicios Bajo Demanda",
    description: "Encuentra profesionales de confianza para tus necesidades del hogar.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="font-sans antialiased min-h-screen flex flex-col">
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                    <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
                )}
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <TooltipProvider>
                            <TickerLED />
                            <Navbar />
                            <main className="flex-1">
                                {children}
                            </main>
                            <Footer />
                            <Toaster position="top-center" richColors />
                        </TooltipProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
