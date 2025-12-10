import React from "react"
import { CheckCircle2, Shield, Users, Zap } from "lucide-react"

export function MissionImagePlaceholder() {
    return (
        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20 rotate-3 hover:rotate-0 transition-all duration-500 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute -top-1/3 -right-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-6 max-w-xs">
                    {/* Verification */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
                            <Shield className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <p className="text-white text-xs font-semibold text-center drop-shadow">Verificación</p>
                    </div>

                    {/* Quality */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
                            <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <p className="text-white text-xs font-semibold text-center drop-shadow">Calidad</p>
                    </div>

                    {/* Community */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
                            <Users className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <p className="text-white text-xs font-semibold text-center drop-shadow">Comunidad</p>
                    </div>

                    {/* Performance */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
                            <Zap className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <p className="text-white text-xs font-semibold text-center drop-shadow">Eficiencia</p>
                    </div>
                </div>

                {/* Center accent */}
                <div className="mt-8 text-center">
                    <div className="inline-block p-4 bg-white/10 backdrop-blur rounded-full border border-white/20">
                        <p className="text-white text-sm font-bold drop-shadow">Fixia</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
