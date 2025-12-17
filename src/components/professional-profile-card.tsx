"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Globe, Award } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrustBadge, TrustBadgesGroup } from "@/components/ui/trust-badges"
import { PremiumBadge } from "@/components/ui/premium-badge"
import { RatingBadge } from "@/components/ui/rating-badge"

interface ProfessionalProfileCardProps {
  id: string
  name: string
  title: string
  avatar: string
  coverImage?: string
  rating: number
  reviewsCount: number
  completedJobs: number
  location: string
  bio: string
  phone?: string
  email?: string
  website?: string
  isVerified: boolean
  isPremium?: "gold" | "platinum" | "diamond"
  badges?: Array<"verified" | "expert" | "fast" | "secure" | "favorite" | "trending">
  responseTime?: string
  onMessage?: () => void
  onHire?: () => void
}

export function ProfessionalProfileCard({
  id,
  name,
  title,
  avatar,
  coverImage,
  rating,
  reviewsCount,
  completedJobs,
  location,
  bio,
  phone,
  email,
  website,
  isVerified,
  isPremium,
  badges = ["verified"],
  responseTime,
  onMessage,
  onHire,
}: ProfessionalProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-[#d97757]/20 hover:border-[#d97757]/50 hover:shadow-[#d97757]/20 group">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-[#d97757]/20 to-[#6a9bcc]/20 group-hover:from-[#d97757]/30 group-hover:to-[#6a9bcc]/30 transition-all duration-500">
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          {/* Avatar + Basic Info */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-3 items-start flex-1">
              <div className={coverImage ? "-mt-16 sm:-mt-20 relative z-10" : ""}>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-card shadow-lg">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {name}
                  </h3>
                  {isPremium && (
                    <PremiumBadge tier={isPremium} size="sm" animated={false} />
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  {title}
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TrustBadgesGroup
                badges={badges as any}
                size="sm"
                showLabels={false}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#e8e6dc]/50 dark:border-border/50">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold" style={{ color: "#d97757" }}>
                {completedJobs}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Trabajos
              </p>
            </div>
            <div className="text-center border-x border-[#e8e6dc]/50 dark:border-border/50">
              <RatingBadge rating={rating} size="sm" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {reviewsCount} reseñas
              </p>
            </div>
            <div className="text-center">
              {responseTime && (
                <>
                  <div className="text-xs sm:text-sm font-semibold" style={{ color: "#6a9bcc" }}>
                    {responseTime}
                  </div>
                  <p className="text-xs text-muted-foreground">Respuesta</p>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bio}
            </p>
          )}

          {/* Contact Info */}
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground group/contact">
              <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: "#d97757" }} />
              <span>{location}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground group/contact">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "#6a9bcc" }} />
                <span className="truncate">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground group/contact">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#788c5d" }} />
                <span className="truncate">{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground group/contact">
                <Globe className="h-4 w-4 flex-shrink-0" style={{ color: "#d97757" }} />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate transition-colors"
                  style={{ color: "#6a9bcc" }}
                >
                  {website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-[#6a9bcc] text-[#6a9bcc] hover:bg-[#6a9bcc]/10 transition-colors"
              onClick={onMessage}
            >
              Mensaje
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[#d97757] to-[#d97757]/90 hover:from-[#d97757]/90 hover:to-[#d97757] text-white transition-all shadow-md hover:shadow-lg"
              onClick={onHire}
            >
              Contratar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
