"use client"

import { motion } from "framer-motion"
import { Search, CheckCircle2, MessageSquare, Sparkles } from "lucide-react"

const steps = [
    {
        title: "Buscás",
        desc: "Describe lo que necesitás en segundos.",
        icon: <Search className="h-8 w-8" />,
        color: "#d97757"
    },
    {
        title: "Comparás",
        desc: "Recibís presupuestos de profesionales verificados.",
        icon: <MessageSquare className="h-8 w-8" />,
        color: "#6a9bcc"
    },
    {
        title: "Solucionás",
        desc: "Elegís al mejor y coordinás directo.",
        icon: <CheckCircle2 className="h-8 w-8" />,
        color: "#788c5d"
    }
]

export function VisualProcess() {
    return (
        <section className="py-24 relative overflow-hidden bg-stone-50 dark:bg-muted/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                    <div className="flex-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97757]/10 text-[#d97757] text-sm font-bold uppercase tracking-wider">
                                <Sparkles className="h-4 w-4" /> El Proceso Fixia
                            </span>
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mt-4 leading-none uppercase">
                                Simple. <br />
                                Rápido. <br />
                                <span className="text-[#6a9bcc]">Seguro.</span>
                            </h2>
                            <p className="text-muted-foreground text-xl max-w-md pt-4">
                                Eliminamos la fricción entre la necesidad y la solución. Sin vueltas, sin intermediarios.
                            </p>
                        </motion.div>
                    </div>

                    <div className="flex-1 grid gap-4 w-full">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="group bg-white dark:bg-card p-8 rounded-[2rem] border border-stone-200 dark:border-border flex items-center gap-8 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500"
                            >
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"
                                    style={{ backgroundColor: step.color + '20', color: step.color }}
                                >
                                    {step.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-muted-foreground font-medium">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
