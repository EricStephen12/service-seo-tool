import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(userId: string, action: string, limit: number, window: number) {
    const key = `ratelimit:${userId}:${action}`;
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, window); // window in seconds
    }

    if (count > limit) {
        throw new Error('Rate limit exceeded');
    }

    return { remaining: Math.max(0, limit - count) };
}
