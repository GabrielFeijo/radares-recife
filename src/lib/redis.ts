import { createClient, type RedisClientType } from "redis";

let redis: RedisClientType | null = null;
let connectionFailed = false;
let connectionPromise: Promise<RedisClientType | null> | null = null;

async function connect(redisUrl: string): Promise<RedisClientType | null> {
	try {
		const client = createClient({
			url: redisUrl,
			socket: {
				connectTimeout: 2000,
				reconnectStrategy: (retries) => {
					if (retries > 2) {
						connectionFailed = true;
						return false;
					}
					return 1000;
				},
			},
		});

		client.on("error", () => {});

		await client.connect();
		connectionFailed = false;
		redis = client as RedisClientType;
		return redis;
	} catch {
		connectionFailed = true;
		redis = null;
		return null;
	} finally {
		connectionPromise = null;
	}
}

export async function getRedisClient(): Promise<RedisClientType | null> {
	const redisUrl = process.env.REDIS_URL;
	if (!redisUrl || connectionFailed) {
		return null;
	}

	if (redis?.isOpen) {
		return redis;
	}

	if (connectionPromise) {
		return connectionPromise;
	}

	connectionPromise = connect(redisUrl);
	return connectionPromise;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return null;
		const data = await client.get(key);
		return data ? JSON.parse(data) : null;
	} catch {
		return null;
	}
}

export async function setCachedData<T>(
	key: string,
	data: T,
	ttlInSeconds = 86400,
): Promise<void> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return;
		await client.setEx(key, ttlInSeconds, JSON.stringify(data));
	} catch {}
}

export async function deleteCachedData(key: string): Promise<void> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return;
		await client.del(key);
	} catch {}
}

export const CACHE_KEYS = {
	RADARS: "radars_data",
	CAMERAS: "cameras_data",
} as const;

export const CACHE_TTL = 24 * 60 * 60;
