import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { TickerLED } from "@/components/ticker-led";
import { AuthProvider } from "@/providers/auth-provider";
import { CookieBanner } from "@/components/cookie-banner";

import GoogleAnalytics from "@/components/google-analytics";

// Brand Guidelines Typography
const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
    fallback: ['Arial', 'sans-serif'],
});

const lora = Lora({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fixia.app"),
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
        icon: "/favicon.png",
        shortcut: "/favicon.png",
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
            <body className={`${lora.variable} ${poppins.variable} font-sans antialiased min-h-screen flex flex-col`}>
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
                            {children}
                            <Toaster position="top-center" richColors />
                        </TooltipProvider>
                        <CookieBanner />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
