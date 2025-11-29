"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface GalleryImage {
    id: string
    src: string
    alt: string
    thumbnail: string
}

interface OptimizedImageGalleryProps {
    images: GalleryImage[]
    columns?: number
}

export function OptimizedImageGallery({
    images,
    columns = 3,
}: OptimizedImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
    const [loadedImages, setLoadedImages] = React.useState<Set<string>>(new Set())

    const handleImageLoad = (id: string) => {
        setLoadedImages((prev) => new Set(prev).add(id))
    }

    const handlePrevious = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    }

    const handleNext = () => {
        if (selectedIndex === null) return
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    }

    const currentImage = selectedIndex !== null ? images[selectedIndex] : null

    return (
        <>
            {/* Gallery Grid */}
            <div
                className={`grid gap-4`}
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
                }}
            >
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setSelectedIndex(index)}
                        className="relative group overflow-hidden rounded-lg aspect-square bg-muted"
                    >
                        {!loadedImages.has(image.id) && (
                            <Skeleton className="absolute inset-0" />
                        )}
                        <Image
                            src={image.thumbnail}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onLoad={() => handleImageLoad(image.id)}
                            priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-sm font-medium">Ver</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
                <DialogContent className="max-w-4xl p-0 bg-black border-0">
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>

                    {currentImage && (
                        <div className="relative aspect-auto max-h-[80vh]">
                            <Image
                                src={currentImage.src}
                                alt={currentImage.alt}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                            className="bg-white/10 hover:bg-white/20 text-white"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <span className="text-white text-sm font-medium">
                            {selectedIndex !== null ? selectedIndex + 1 : 0} / {images.length}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            className="bg-white/10 hover:bg-white/20 text-white"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
