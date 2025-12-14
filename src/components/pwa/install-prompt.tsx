"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);

        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible && !isIOS) return null;

    // For now, we'll focus on the standard install prompt for Android/Desktop
    // iOS requires a different approach (tooltip pointing to share button) which we can add later if requested
    if (isIOS) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
                >
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-4 flex items-center gap-4">
                        <div className="flex-shrink-0 bg-stone-100 dark:bg-stone-800 rounded-xl p-2">
                            <Image src="/logo.svg" alt="Fixia Logo" width={40} height={40} className="w-10 h-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-stone-900 dark:text-white text-sm">Instalar Fixia</h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">Accede más rápido desde tu inicio</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={handleInstallClick}
                                className="bg-stone-900 hover:bg-orange-600 text-white rounded-lg h-9 px-4 text-xs font-medium transition-colors"
                            >
                                Instalar
                            </Button>
                            <button
                                onClick={handleClose}
                                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
