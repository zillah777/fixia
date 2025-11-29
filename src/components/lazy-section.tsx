"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface LazySectionProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    threshold?: number
    triggerOnce?: boolean
}

/**
 * Lazy Section Component
 * Renders content only when it becomes visible in the viewport
 * Useful for performance optimization of below-the-fold content
 */
export function LazySection({
    children,
    fallback,
    threshold = 0.1,
    triggerOnce = true,
}: LazySectionProps) {
    const [isVisible, setIsVisible] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        // Check if Intersection Observer is supported
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce && ref.current) {
                        observer.unobserve(ref.current)
                    }
                }
            },
            { threshold }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [threshold, triggerOnce])

    return (
        <div ref={ref}>
            {isVisible ? children : fallback}
        </div>
    )
}

/**
 * Lazy Image Component
 * Optimized image loading with native lazy loading and Intersection Observer fallback
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    placeholder?: string
}

export function LazyImage({
    src,
    alt,
    placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
    ...props
}: LazyImageProps) {
    const [imageSrc, setImageSrc] = React.useState(placeholder)
    const [isLoading, setIsLoading] = React.useState(true)
    const ref = React.useRef<HTMLImageElement>(null)

    React.useEffect(() => {
        // Use Intersection Observer for better performance
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setImageSrc(src)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setImageSrc(src)
                    if (ref.current) {
                        observer.unobserve(ref.current)
                    }
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [src])

    return (
        <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            className={`transition-opacity duration-300 ${
                isLoading ? "opacity-50" : "opacity-100"
            }`}
            {...props}
        />
    )
}
