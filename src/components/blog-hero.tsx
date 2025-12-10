import React from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogHeroProps {
    title: string
    category: string
    date: string
    readTime: string
    slug: string
}

export function BlogHero({ title, category, date, readTime, slug }: BlogHeroProps) {
    const getGradientForSlug = (slug: string) => {
        switch (slug) {
            case "como-elegir-profesional":
                return "from-indigo-600 via-indigo-500 to-indigo-400"
            case "tendencias-remodelacion-2025":
                return "from-emerald-600 via-emerald-500 to-emerald-400"
            case "mantenimiento-preventivo":
                return "from-amber-600 via-amber-500 to-amber-400"
            default:
                return "from-primary via-primary/80 to-primary/60"
        }
    }

    return (
        <div className={`w-full h-[40vh] md:h-[50vh] relative bg-gradient-to-br ${getGradientForSlug(slug)} overflow-hidden`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/3 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/4 -left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Actual content */}
            <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 relative z-10">
                <Link href="/blog">
                    <Button variant="ghost" className="text-white mb-6 hover:text-white hover:bg-white/20">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
                    </Button>
                </Link>
                <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 backdrop-blur">{category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight drop-shadow-lg">
                    {title}
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {date}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {readTime} de lectura
                    </div>
                </div>
            </div>
        </div>
    )
}
