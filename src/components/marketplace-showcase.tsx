"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Zap,
  Award,
  Users,
  Wrench,
  Lightbulb,
  Heart,
  TrendingUp,
} from "lucide-react"
import { TrustBadge, TrustBadgesGroup } from "@/components/ui/trust-badges"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { RatingBadge } from "@/components/ui/rating-badge"
import { CategoryBadge } from "@/components/ui/category-badge"
import { InfoBadge } from "@/components/ui/info-badge"
import { FeatureHighlight } from "@/components/ui/feature-highlight"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function MarketplaceShowcase() {
  return (
    <div className="space-y-16 py-12">
      {/* Trust & Safety Section */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Confía en Fixia
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Profesionales verificados, transacciones seguras y garantía total.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="verified" size="md" showLabel />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="secure" size="md" showLabel />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="fast" size="md" showLabel />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="expert" size="md" showLabel />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="trending" size="md" showLabel />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <TrustBadge variant="favorite" size="md" showLabel />
          </motion.div>
        </motion.div>
      </section>

      {/* Premium Tiers */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Profesionales Destacados
          </h2>
          <p className="text-muted-foreground text-lg">
            Niveles de excelencia en nuestro marketplace.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <PremiumBadge tier="gold" size="md" />
          <PremiumBadge tier="platinum" size="md" />
          <PremiumBadge tier="diamond" size="md" />
        </div>
      </section>

      {/* Status Examples */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Estados de Servicios
          </h2>
          <p className="text-muted-foreground text-lg">
            Información clara sobre cada servicio.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="active" size="sm" animated />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="pending" size="sm" animated />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="warning" size="sm" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="error" size="sm" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="paused" size="sm" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <StatusBadge status="launching" size="sm" animated />
          </motion.div>
        </motion.div>
      </section>

      {/* Rating System */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Sistema de Calificación
          </h2>
          <p className="text-muted-foreground text-lg">
            Calificaciones verificadas de usuarios reales.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <motion.div variants={item} className="flex justify-center">
            <RatingBadge rating={5} count={342} showCount />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <RatingBadge rating={4.8} count={215} showCount />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <RatingBadge rating={4.5} count={128} showCount />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <RatingBadge rating={4.2} count={87} showCount />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <RatingBadge rating={3.8} count={45} showCount />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Categorías Populares
          </h2>
          <p className="text-muted-foreground text-lg">
            Explora servicios por categoría.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={Wrench} label="Plomería" color="primary" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={Zap} label="Electricidad" color="amber" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={Users} label="Limpieza" color="emerald" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={Heart} label="Pintura" color="orange" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={Award} label="Carpintería" color="primary" />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <CategoryBadge icon={TrendingUp} label="Más" color="accent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features with Badges */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Por Qué Elegirnos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Creemos en la transparencia, calidad y confianza.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Shield}
              title="100% Seguro"
              description="Pagos protegidos y profesionales verificados para tu tranquilidad."
              badge="Garantizado"
              badgeColor="emerald"
            />
          </motion.div>
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Zap}
              title="Respuesta Rápida"
              description="Encuentra profesionales disponibles en minutos."
              badge="Instant"
              badgeColor="amber"
              highlighted
            />
          </motion.div>
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Award}
              title="Calidad Asegurada"
              description="Solo profesionales con excelentes calificaciones."
              badge="Top Rated"
              badgeColor="orange"
            />
          </motion.div>
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Users}
              title="Comunidad Activa"
              description="Miles de usuarios satisfechos en nuestra plataforma."
              badge="Community"
              badgeColor="teal"
            />
          </motion.div>
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Heart}
              title="Favoritos"
              description="Guarda tus profesionales favoritos para futuras solicitudes."
              badge="Feature"
              badgeColor="emerald"
            />
          </motion.div>
          <motion.div variants={item}>
            <FeatureHighlight
              icon={Lightbulb}
              title="Tips & Consejos"
              description="Aprende de nuestros expertos y optimiza tus proyectos."
              badge="Helpful"
              badgeColor="amber"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Info Badges */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Información Importante
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <motion.div variants={item} className="flex justify-center">
            <InfoBadge
              type="success"
              text="¡Tu perfil ha sido verificado exitosamente!"
              size="md"
              dismissible
            />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <InfoBadge
              type="tip"
              text="Completa tu perfil para aumentar tus posibilidades de conseguir más solicitudes."
              size="md"
              dismissible
            />
          </motion.div>
          <motion.div variants={item} className="flex justify-center">
            <InfoBadge
              type="info"
              text="Nuevos servicios disponibles en tu área. Explora las oportunidades."
              size="md"
              dismissible
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
