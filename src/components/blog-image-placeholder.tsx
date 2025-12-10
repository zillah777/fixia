import React from "react"
import { CheckCircle2, Sparkles, Wrench, TrendingUp } from "lucide-react"

interface BlogImagePlaceholderProps {
    slug: string
    title: string
}

export function BlogImagePlaceholder({ slug, title }: BlogImagePlaceholderProps) {
    const getGradientConfig = (slug: string) => {
        switch (slug) {
            case "como-elegir-profesional":
                return {
                    gradient: "from-indigo-500 via-indigo-400 to-indigo-300",
                    icon: CheckCircle2,
                    bgAccent: "bg-indigo-600/20"
                }
            case "tendencias-remodelacion-2025":
                return {
                    gradient: "from-emerald-500 via-emerald-400 to-emerald-300",
                    icon: Sparkles,
                    bgAccent: "bg-emerald-600/20"
                }
            case "mantenimiento-preventivo":
                return {
                    gradient: "from-amber-500 via-amber-400 to-amber-300",
                    icon: Wrench,
                    bgAccent: "bg-amber-600/20"
                }
            default:
                return {
                    gradient: "from-blue-500 via-blue-400 to-blue-300",
                    icon: TrendingUp,
                    bgAccent: "bg-blue-600/20"
                }
        }
    }

    const config = getGradientConfig(slug)
    const Icon = config.icon

    return (
        <div className={`aspect-[16/9] relative overflow-hidden bg-gradient-to-br ${config.gradient} rounded-lg`}>
            {/* Animated background circles */}
            <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center">
                <div className={`p-6 rounded-full ${config.bgAccent} mb-4`}>
                    <Icon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                <p className="text-white text-center text-sm font-semibold drop-shadow-lg px-4 max-w-xs">
                    {title.substring(0, 40)}
                    {title.length > 40 ? "..." : ""}
                </p>
            </div>
        </div>
    )
}
