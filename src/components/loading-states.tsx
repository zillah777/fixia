"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Loading skeleton for service cards
 */
export function ServiceCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}

/**
 * Loading skeleton for data table
 */
export function DataTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                ))}
            </div>
            {/* Rows */}
            {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-3 border-b">
                    {[...Array(5)].map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-6" />
                    ))}
                </div>
            ))}
        </div>
    )
}

/**
 * Loading skeleton for dashboard stats
 */
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

/**
 * Loading skeleton for charts
 */
export function ChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="w-full h-64 rounded-lg" />
            </CardContent>
        </Card>
    )
}

/**
 * Loading skeleton for profile
 */
export function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Full page loading spinner
 */
export function PageLoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-4 text-center">
                <div className="relative h-12 w-12 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/20" />
                    <div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                        style={{
                            animation: "spin 1s linear infinite",
                        }}
                    />
                </div>
                <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
