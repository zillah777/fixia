"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ServiceCardProps {
    data: {
        id: string
        title: string
        description: string
        price: number
        category: string
        images: string[]
        tags: string[]
        provider: {
            id: string
            name: string
            avatar: string | null
            rating: number
            badges: string[]
        }
    }
    className?: string
}

export function ServiceCard({ data, className }: ServiceCardProps) {
    const router = useRouter()
    const mainImage = data.images.length > 0 ? data.images[0] : "/placeholder-service.jpg"
    const firstName = data.provider.name.split(" ")[0]

    const handleHire = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation to profile
        try {
            const res = await fetch("/api/matches/hire", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceId: data.id,
                    providerId: data.provider.id,
                    price: data.price,
                    title: data.title
                })
            })

            const result = await res.json()

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("No puedes contratar nuevos servicios", {
                        description: "Tienes trabajos finalizados sin calificar. Por favor, califica a tus profesionales anteriores."
                    })
                    return
                }
                throw new Error(result.error || "Error al contratar")
            }

            toast.success("Solicitud enviada", {
                description: `Se ha enviado una propuesta a ${firstName}. Te notificaremos cuando responda.`
            })

        } catch (error) {
            console.error(error)
            toast.error("Error al procesar la solicitud", {
                description: "Por favor intenta nuevamente o inicia sesión."
            })
            // Redirect to login if potentially unauthorized
            // router.push("/login")
        }
    }

    return (
        <div className={cn("group flex flex-col gap-3 rounded-xl transition-all h-full", className)}>
            {/* Image Container */}
            <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-muted shadow-sm group-hover:shadow-md transition-all">
                <Link href={`/professionals/${data.provider.id}`} className="absolute inset-0 z-10" />
                <Image
                    src={mainImage}
                    alt={data.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-3 right-3 z-20 rounded-full p-2 hover:scale-110 transition-all">
                    <Heart className="h-6 w-6 text-white drop-shadow-md hover:fill-red-500 hover:text-destructive transition-colors" />
                </button>
                <div className="absolute top-3 left-3 z-20 flex gap-1 flex-wrap">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 font-medium text-xs shadow-sm capitalize">
                        {data.category}
                    </Badge>
                </div>
            </div>

            {/* Info & Action */}
            <div className="flex flex-col gap-2 flex-grow">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-base leading-tight line-clamp-2" title={data.title}>
                        {data.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap shrink-0">
                        <Star className="h-3.5 w-3.5 fill-black text-black" />
                        <span>{data.provider.rating > 0 ? data.provider.rating.toFixed(1) : "Nuevo"}</span>
                    </div>
                </div>

                {/* Professional Info (Avatar & Badges) */}
                <div className="flex items-center gap-2 mt-1">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-muted shrink-0">
                        <Image
                            src={data.provider.avatar || `https://ui-avatars.com/api/?name=${firstName}&background=random`}
                            alt={firstName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium truncate">{firstName}</span>
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide w-full mask-linear-fade">
                            {data.provider.badges.map((badge, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] px-1 h-4 border-secondary/20 bg-secondary/5 text-secondary whitespace-nowrap shrink-0">
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-lg truncate">${data.price.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs truncate">estimado</span>
                    </div>
                    <Button size="sm" className="rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0" onClick={handleHire}>
                        Contratar
                    </Button>
                </div>
            </div>
        </div>
    )
}
