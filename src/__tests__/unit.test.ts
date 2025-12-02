import { cn } from "@/lib/utils"
import { rateLimit } from "@/lib/rate-limit"

describe("Utility Functions", () => {
    describe("cn (ClassName Utility)", () => {
        it("should merge class names correctly", () => {
            expect(cn("c1", "c2")).toBe("c1 c2")
        })

        it("should handle conditional classes", () => {
            expect(cn("c1", true && "c2", false && "c3")).toBe("c1 c2")
        })

        it("should merge tailwind classes using tailwind-merge", () => {
            expect(cn("p-4", "p-2")).toBe("p-2")
            expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
        })
    })

    describe("rateLimit", () => {
        it("should allow requests within limit", async () => {
            const limiter = rateLimit({ interval: 1000, uniqueTokenPerInterval: 10 })
            await expect(limiter.check(5, "token1")).resolves.not.toThrow()
            await expect(limiter.check(5, "token1")).resolves.not.toThrow()
        })

        it("should block requests exceeding limit", async () => {
            const limiter = rateLimit({ interval: 1000, uniqueTokenPerInterval: 10 })
            const token = "token2"

            // Consume limit
            await limiter.check(2, token)
            await limiter.check(2, token)

            // Should fail on 3rd attempt if limit is 2
            await expect(limiter.check(2, token)).rejects.toThrow("Rate limit exceeded")
        })

        it("should reset after interval", async () => {
            jest.useFakeTimers()
            const limiter = rateLimit({ interval: 1000, uniqueTokenPerInterval: 10 })
            const token = "token3"

            await limiter.check(1, token)

            // Advance time past interval
            jest.advanceTimersByTime(1100)

            // Should succeed again
            await expect(limiter.check(1, token)).resolves.not.toThrow()
            jest.useRealTimers()
        })
    })
})
