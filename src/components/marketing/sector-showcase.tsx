"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Home, Building2, Briefcase } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"

const sectors = [
    {
        title: "Hogares",
        desc: "Mantenimiento integral, reparaciones y mejoras para tu casa.",
        image: "/assets/marketing/home-service.png",
        icon: <Home className="h-6 w-6" />,
        color: "#d97757"
    },
    {
        title: "Oficinas",
        desc: "Soporte técnico, instalaciones y servicios preventivos corporativos.",
        image: "/assets/marketing/office-service.png",
        icon: <Briefcase className="h-6 w-6" />,
        color: "#6a9bcc"
    },
    {
        title: "Locales y Empresas",
        desc: "Soluciones a gran escala para comercios, industrias y startups.",
        image: "/assets/marketing/commercial-service.png",
        icon: <Building2 className="h-6 w-6" />,
        color: "#788c5d"
    }
]

export function SectorShowcase() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-bold tracking-tight mb-6"
                    >
                        Un Universo de Servicios <br />
                        <span className="text-[#d97757]">Para cada necesidad</span>
                    </motion.h2>
                    <p className="text-muted-foreground text-lg italic">
                        &quot;Fixia nació para simplificar la vida de quienes trabajan y viven en Argentina. Desde un hogar hasta una multinacional.&quot;
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sectors.map((sector, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <TiltCard className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02]">
                                <Image
                                    src={sector.image}
                                    alt={sector.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 w-full space-y-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                        style={{ backgroundColor: sector.color }}
                                    >
                                        {sector.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{sector.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        {sector.desc}
                                    </p>
                                    <div className="flex items-center text-white font-bold pt-2 group-hover:gap-2 transition-all">
                                        Saber más <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
