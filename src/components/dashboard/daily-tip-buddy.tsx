"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Lottie from "lottie-react"
import { X, Lightbulb, ChevronRight } from "lucide-react"
import Link from "next/link"
import { CLIENT_TIPS, PROFESSIONAL_TIPS, DailyTip } from "@/lib/tips-data"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

// Generic happy robot animation from LottieFiles public URL
// If this URL fails, we can replace it with a local JSON or another URL.
// This is a placeholder for a "Cute Robot"
const ROBOT_ANIMATION_URL = "https://lottie.host/5a92a544-7065-430b-927c-3f4007887556/6J3p8uX5sW.json"

export function DailyTipBuddy() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [tip, setTip] = useState<DailyTip | null>(null)
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        // 1. Check if user is logged in
        if (!user) return

        // 2. Check LocalStorage for "last_tip_date"
        const lastTipDate = localStorage.getItem("fixia_last_tip_date")
        const today = new Date().toDateString()

        if (lastTipDate === today) {
            return // Already saw tip today
        }

        // 3. Select Tip based on Role
        const tips = user.role === "PROFESSIONAL" ? PROFESSIONAL_TIPS : CLIENT_TIPS
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        setTip(randomTip)

        // 4. Fetch Lottie JSON (client-side only to avoid build issues)
        fetch(ROBOT_ANIMATION_URL)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Failed to load buddy animation", err))

        // 5. Show after a small delay
        const timer = setTimeout(() => setIsVisible(true), 2000)
        return () => clearTimeout(timer)
    }, [user])

    const handleClose = () => {
        setIsVisible(false)
        const today = new Date().toDateString()
        localStorage.setItem("fixia_last_tip_date", today)
    }

    if (!isVisible || !tip || !animationData) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    drag
                    dragConstraints={{ left: -200, right: 0, top: -500, bottom: 0 }}
                    className="fixed bottom-4 right-4 z-50 flex items-end gap-3 pointer-events-auto sm:bottom-8 sm:right-8"
                >
                    {/* Speech Bubble */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-br-none shadow-xl border border-slate-100 dark:border-slate-700 max-w-[280px] sm:max-w-[320px] relative mb-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full shrink-0">
                                <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                                    Tip del Día
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {tip.text}
                                </p>

                                {tip.actionLabel && tip.actionUrl && (
                                    <Link href={tip.actionUrl}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 h-auto py-1 px-2 text-primary hover:text-primary/80 p-0 text-xs font-semibold"
                                        >
                                            {tip.actionLabel} <ChevronRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Character (The "Buddy") */}
                    <div
                        className="relative w-24 h-24 sm:w-28 sm:h-28 cursor-grab active:cursor-grabbing"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Lottie
                            animationData={animationData}
                            loop={true} // Always loop to be alive
                            autoPlay={true}
                            className="w-full h-full drop-shadow-lg"
                        />
                        <div className="absolute -bottom-2 w-full text-center">
                            <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                Arrástrame
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
