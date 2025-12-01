"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

// Note: In a real implementation, we would use the 'use-sound' hook here.
// For now, we'll simulate the sound effect trigger or use a simple HTML5 Audio if needed.

interface MatchCelebrationProps {
    isOpen: boolean
    onClose: () => void
    proName: string
    proAvatar: string
    proPhone: string
}

export function MatchCelebration({ isOpen, onClose, proName, proAvatar, proPhone }: MatchCelebrationProps) {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (isOpen) {
            // Trigger Confetti
            const duration = 3 * 1000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
            }, 250)

            // Play Sound (Simulated)
            const audio = new Audio('/sounds/match-pop.mp3') // Make sure this file exists or use a CDN
            audio.volume = 0.5
            audio.play().catch(e => console.log("Audio play failed (user interaction needed)", e))

            // Show content with delay
            setTimeout(() => setShowContent(true), 500)

            return () => clearInterval(interval)
        } else {
            setShowContent(false)
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-full max-w-sm"
                    >
                        <Card className="border-none shadow-2xl overflow-hidden bg-white relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-green-400 to-emerald-600" />

                            <div className="relative pt-16 pb-8 px-6 flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={proAvatar} />
                                        <AvatarFallback>{proName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-sm">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Es un Match!</h2>
                                <p className="text-gray-500 mb-6">
                                    Has contratado a <span className="font-semibold text-gray-900">{proName}</span>
                                </p>

                                <div className="w-full space-y-3">
                                    <a
                                        href={`https://wa.me/${proPhone}?text=Hola ${proName}, te contacté por Fixia!`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 rounded-xl shadow-lg shadow-green-500/30 transition-transform hover:scale-105">
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            Contactar por WhatsApp
                                        </Button>
                                    </a>

                                    <Button variant="ghost" className="w-full rounded-xl" onClick={onClose}>
                                        Cerrar y ver detalles
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
