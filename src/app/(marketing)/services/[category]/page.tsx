"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Search, ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { StandardizedEmptyState } from "@/components/onboarding/standardized-empty-state"
import Link from "next/link"
import Image from "next/image"

interface Service {
    id: string
    title: string
    description: string
    price: number
    category: string
    images?: string[]
    provider: {
        id: string
        name: string
        avatar?: string
        rating: number
    }
}

export default function CategoryServicesPage() {
    const params = useParams()
    const category = params?.category as string
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchServices = useCallback(async () => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            queryParams.append("category", category)
            if (search) queryParams.append("search", search)

            const res = await fetch(`/api/public/services?${queryParams.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setServices(data)
            }
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }, [category, search])

    useEffect(() => {
        if (category) {
            fetchServices()
        }
    }, [category, fetchServices])

    const categoryNames: Record<string, string> = {
        plomeria: "Plomería",
        electricidad: "Electricidad",
        gas: "Gasista",
        pintura: "Pintura",
        carpinteria: "Carpintería",
        fletes: "Fletes",
        belleza: "Belleza",
        tecnologia: "Tecnología",
        jardineria: "Jardinería",
        albanileria: "Albañilería"
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            {/* Header */}
            <div className="mb-12 relative overflow-visible">
                <Link href="/services" className="inline-flex items-center gap-2 text-[#b0aea5] hover:text-[#d97757] mb-6 transition-colors font-medium">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a categorías
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#141413] dark:text-[#faf9f5] mb-4">
                            {categoryNames[category] || category}
                        </h1>
                        <p className="text-[#b0aea5] text-lg font-medium">
                            Encuentra soluciones excepcionales en {categoryNames[category] || category}.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="w-full md:max-w-md relative group">
                        <div className="absolute inset-x-0 -bottom-2 h-10 bg-[#6a9bcc]/10 blur-xl group-hover:bg-[#6a9bcc]/20 transition-all rounded-full" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b0aea5] z-10" />
                        <Input
                            placeholder="Filtrar por título o descripción..."
                            className="pl-12 pr-4 h-14 text-base bg-white dark:bg-[#1c1c1b] border-2 border-[#e8e6dc] dark:border-white/5 rounded-2xl focus:border-[#d97757] dark:focus:border-[#d97757] transition-all relative z-10 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-96 border-none bg-white dark:bg-[#1c1c1b] rounded-[32px] animate-pulse" />
                    ))}
                </div>
            ) : services.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <StandardizedEmptyState
                        icon={Search}
                        title="Sin resultados"
                        description={`No encontramos servicios de ${categoryNames[category] || category} que coincidan con tu búsqueda.`}
                        action={{
                            label: "Explorar todo",
                            onClick: () => setSearch(""),
                        }}
                    />
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (i % 3) * 0.1 }}
                        >
                            <Card className="group h-full overflow-hidden border-none bg-white dark:bg-[#1c1c1b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(217,119,87,0.12)] transition-all duration-500 rounded-[40px] flex flex-col relative">
                                <CardHeader className="p-0 relative h-56 overflow-hidden">
                                    {service.images && service.images.length > 0 ? (
                                        <div className="h-full w-full relative">
                                            <Image
                                                src={service.images[0]}
                                                alt={service.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/60 via-transparent to-transparent opacity-60" />
                                        </div>
                                    ) : (
                                        <div className="h-full w-full bg-[#141413] flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97757_1px,transparent_1px)] [background-size:20px_20px]" />
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#d97757]/40 to-transparent" />
                                            <div className="text-white text-center p-8 relative z-10">
                                                <h3 className="text-3xl font-black mb-2 drop-shadow-2xl uppercase tracking-tighter leading-none italic">{service.title}</h3>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 z-20">
                                        <Badge className="bg-white/95 dark:bg-[#141413]/90 text-[#d97757] border-none shadow-xl backdrop-blur-md px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-full">
                                            Servicio Elite
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-black text-[#141413] dark:text-[#faf9f5] mb-4 group-hover:text-[#d97757] transition-colors leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-[#b0aea5] text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Provider Info - Premium Glass */}
                                    <div className="flex items-center gap-4 mb-8 p-4 rounded-3xl bg-[#faf9f5] dark:bg-[#141413]/40 border border-[#e8e6dc]/60 dark:border-white/5 shadow-sm">
                                        <div className="relative">
                                            <Avatar className="h-14 w-14 rounded-2xl border-2 border-white dark:border-white/10 shadow-lg overflow-hidden">
                                                <AvatarImage
                                                    src={service.provider.avatar || `https://ui-avatars.com/api/?name=${service.provider.name}&background=random`}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-[#e8e6dc] text-[#141413] font-bold">{service.provider.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#788c5d] border-2 border-[#faf9f5] dark:border-[#141413] rounded-full" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-sm text-[#141413] dark:text-[#faf9f5]">{service.provider.name}</p>
                                            <div className="flex items-center gap-1.5">
                                                <Star className="h-3 w-3 fill-[#d97757] text-[#d97757]" />
                                                <span className="text-xs font-bold text-[#b0aea5]">{service.provider.rating.toFixed(1)} Rating</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#e8e6dc]/40 dark:border-white/5 mx-[-8px]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-[#b0aea5] font-black tracking-widest">Inversión</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-[#141413] dark:text-[#faf9f5]">
                                                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(service.price)}
                                                </span>
                                                <span className="text-[10px] text-[#b0aea5] font-bold">/serv</span>
                                            </div>
                                        </div>
                                        <Link href={`/professionals/${service.provider.id}`}>
                                            <Button size="lg" className="bg-[#141413] dark:bg-[#faf9f5] text-white dark:text-[#141413] rounded-2xl font-black px-6 hover:bg-[#d97757] dark:hover:bg-[#d97757] transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#d97757]/20">
                                                Ver Perfil
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
