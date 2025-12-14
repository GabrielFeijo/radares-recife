import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
    if (!redis) {
        redis = createClient({
            url: process.env.REDIS_URL
        });

        redis.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        await redis.connect();
    }

    return redis;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        const client = await getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao buscar dados do cache:', error);
        return null;
    }
}

export async function setCachedData<T>(
    key: string,
    data: T,
    ttlInSeconds: number = 86400
): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.setEx(key, ttlInSeconds, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar dados no cache:', error);
    }
}

export async function deleteCachedData(key: string): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.del(key);
    } catch (error) {
        console.error('Erro ao deletar dados do cache:', error);
    }
}

export const CACHE_KEYS = {
    RADARS: 'radars_data',
    CAMERAS: 'cameras_data'
} as const;

export const CACHE_TTL = 24 * 60 * 60;