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
      <Card className="overflow-hidden hover:shadow-warm transition-all duration-300">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
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
          <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/50">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-primary">
                {completedJobs}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Trabajos
              </p>
            </div>
            <div className="text-center border-x border-border/50">
              <RatingBadge rating={rating} size="sm" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {reviewsCount} reseñas
              </p>
            </div>
            <div className="text-center">
              {responseTime && (
                <>
                  <div className="text-xs sm:text-sm font-semibold text-accent">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 text-accent" />
              <span>{location}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" />
                <span className="truncate">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 flex-shrink-0 text-accent" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
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
              className="flex-1"
              onClick={onMessage}
            >
              Mensaje
            </Button>
            <Button
              className="flex-1 bg-accent hover:bg-accent/90"
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
