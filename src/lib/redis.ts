import { createClient, type RedisClientType } from "redis";

let redis: RedisClientType | null = null;
let connectionFailedAt: number | null = null;
let connectionPromise: Promise<RedisClientType | null> | null = null;

const CONNECTION_RETRY_AFTER_MS = 5 * 60 * 1000;

function isConnectionFailed(): boolean {
	if (connectionFailedAt === null) return false;
	if (Date.now() - connectionFailedAt > CONNECTION_RETRY_AFTER_MS) {
		connectionFailedAt = null;
		return false;
	}
	return true;
}

async function connect(redisUrl: string): Promise<RedisClientType | null> {
	try {
		const client = createClient({
			url: redisUrl,
			socket: {
				connectTimeout: 2000,
				reconnectStrategy: (retries) => {
					if (retries > 2) {
						connectionFailedAt = Date.now();
						return false;
					}
					return 1000;
				},
			},
		});

		client.on("error", () => {});

		await client.connect();
		connectionFailedAt = null;
		redis = client as RedisClientType;
		return redis;
	} catch {
		connectionFailedAt = Date.now();
		redis = null;
		return null;
	} finally {
		connectionPromise = null;
	}
}

export async function getRedisClient(): Promise<RedisClientType | null> {
	const redisUrl = process.env.REDIS_URL;
	if (!redisUrl || isConnectionFailed()) {
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
	} catch (err) {
		console.warn("[redis] setCachedData failed for key:", key, err);
	}
}

export async function deleteCachedData(key: string): Promise<void> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return;
		await client.del(key);
	} catch (err) {
		console.warn("[redis] deleteCachedData failed for key:", key, err);
	}
}

export const CACHE_KEYS = {
	RADARS: "radars_data",
	CAMERAS: "cameras_data",
} as const;

export const CACHE_TTL = 24 * 60 * 60;
