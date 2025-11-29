"use client"

import { useCallback, useRef, useEffect } from "react"

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
}

interface UseCache {
    <T>(key: string, fetcher: () => Promise<T>, ttl?: number): {
        data: T | undefined
        isLoading: boolean
        error: Error | undefined
        refetch: () => Promise<void>
    }
}

// Global cache store
const cacheStore = new Map<string, CacheEntry<any>>()

/**
 * Custom hook for data caching with TTL (Time To Live)
 * @param key - Unique cache key
 * @param fetcher - Async function to fetch data
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 */
export const useCache: UseCache = (key, fetcher, ttl = 5 * 60 * 1000) => {
    const dataRef = useRef<any | undefined>(undefined)
    const isLoadingRef = useRef(false)
    const errorRef = useRef<Error | undefined>(undefined)
    const [, setUpdateTrigger] = useCallback([0], (i: number) => [i + 1])

    const isCacheValid = useCallback(() => {
        const entry = cacheStore.get(key)
        if (!entry) return false
        const age = Date.now() - entry.timestamp
        return age < entry.ttl
    }, [key])

    const fetchData = useCallback(async () => {
        // Return cached data if valid
        if (isCacheValid()) {
            const entry = cacheStore.get(key)
            if (entry) {
                dataRef.current = entry.data
                return
            }
        }

        isLoadingRef.current = true
        errorRef.current = undefined
        setUpdateTrigger((i) => i + 1)

        try {
            const result = await fetcher()
            dataRef.current = result
            cacheStore.set(key, {
                data: result,
                timestamp: Date.now(),
                ttl,
            })
        } catch (error) {
            errorRef.current = error instanceof Error ? error : new Error(String(error))
        } finally {
            isLoadingRef.current = false
            setUpdateTrigger((i) => i + 1)
        }
    }, [key, fetcher, ttl, isCacheValid])

    useEffect(() => {
        // Only fetch if cache is invalid
        if (!isCacheValid()) {
            fetchData()
        } else {
            // Load from cache immediately
            const entry = cacheStore.get(key)
            if (entry) {
                dataRef.current = entry.data
                setUpdateTrigger((i) => i + 1)
            }
        }
    }, [key, isCacheValid, fetchData])

    return {
        data: dataRef.current,
        isLoading: isLoadingRef.current,
        error: errorRef.current,
        refetch: fetchData,
    }
}

/**
 * Clear all cached data
 */
export const clearCache = () => {
    cacheStore.clear()
}

/**
 * Clear specific cache entry
 */
export const clearCacheKey = (key: string) => {
    cacheStore.delete(key)
}

/**
 * Prefetch data into cache
 */
export const prefetchCache = async <T,>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
) => {
    const entry = cacheStore.get(key)
    if (entry && Date.now() - entry.timestamp < (entry.ttl || 5 * 60 * 1000)) {
        return entry.data
    }

    const data = await fetcher()
    cacheStore.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttl || 5 * 60 * 1000,
    })
    return data
}
