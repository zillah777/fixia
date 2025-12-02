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
    title: {
        default: "Fixia - Servicios Bajo Demanda",
        template: "%s | Fixia"
    },
    description: "Encuentra profesionales de confianza para tus necesidades del hogar. Plomería, electricidad, limpieza y más.",
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "es_AR",
        url: "https://fixia.app",
        title: "Fixia - Servicios Bajo Demanda",
        description: "La forma más inteligente de contratar profesionales de confianza.",
        siteName: "Fixia",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Fixia - Servicios del Hogar"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Fixia - Servicios Bajo Demanda",
        description: "Encuentra profesionales de confianza en minutos.",
        images: ["/og-image.jpg"],
        creator: "@fixiaapp"
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png"
    }
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
