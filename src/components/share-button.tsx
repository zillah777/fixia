"use client"

import React from "react"
import { Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ShareButtonProps {
    slug: string
    title: string
}

export function ShareButton({ slug, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false)

    const postUrl = `https://fixia.app/blog/${slug}`

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Lee este artículo en Fixia: ${title}`,
                    url: postUrl
                })
            } catch (err) {
                console.log("Error sharing:", err)
            }
        }
    }

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(postUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`
        window.open(twitterUrl, "_blank", "width=550,height=420")
    }

    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        window.open(facebookUrl, "_blank", "width=550,height=420")
    }

    const shareOnLinkedIn = () => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
        window.open(linkedInUrl, "_blank", "width=550,height=420")
    }

    return (
        <div className="bg-muted/30 rounded-xl p-6 border">
            <h3 className="font-bold text-lg mb-4">Compartir</h3>
            <div className="space-y-2">
                {navigator.share && (
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                    </Button>
                )}
                <Button
                    onClick={shareOnTwitter}
                    variant="outline"
                    className="w-full justify-start"
                >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-5.25 9-5.25s.75-4 2-6c.5-1.5 1-2.5 2-4z" />
                    </svg>
                    Twitter
                </Button>
                <Button
                    onClick={shareOnFacebook}
                    variant="outline"
                    className="w-full justify-start"
                >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
                    </svg>
                    Facebook
                </Button>
                <Button
                    onClick={shareOnLinkedIn}
                    variant="outline"
                    className="w-full justify-start"
                >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                </Button>
                <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="w-full justify-start"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            Enlace copiado
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar enlace
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
