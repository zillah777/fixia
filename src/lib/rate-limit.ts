type RateLimitStore = Map<string, { count: number; lastReset: number }>;

const globalStore: RateLimitStore = new Map();

interface RateLimitOptions {
    interval: number; // in milliseconds
    uniqueTokenPerInterval: number; // max number of unique tokens per interval
}

export function rateLimit(options: RateLimitOptions) {
    const { interval, uniqueTokenPerInterval } = options;

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const now = Date.now();
                const record = globalStore.get(token);

                if (!record) {
                    globalStore.set(token, { count: 1, lastReset: now });
                    resolve();
                    return;
                }

                if (now - record.lastReset > interval) {
                    globalStore.set(token, { count: 1, lastReset: now });
                    resolve();
                    return;
                }

                if (record.count >= limit) {
                    reject(new Error("Rate limit exceeded"));
                    return;
                }

                record.count += 1;
                resolve();

                // Cleanup old tokens to prevent memory leak
                if (globalStore.size > uniqueTokenPerInterval) {
                    const deleteBefore = now - interval;
                    const entries = Array.from(globalStore.entries());
                    for (const [key, value] of entries) {
                        if (value.lastReset < deleteBefore) {
                            globalStore.delete(key);
                        }
                    }
                }
            }),
    };
}
