import { createClient, type RedisClientType } from "redis";

let redis: RedisClientType | null = null;
let isConnecting = false;
let connectionFailed = false;

export async function getRedisClient(): Promise<RedisClientType | null> {
	const redisUrl = process.env.REDIS_URL;
	if (!redisUrl || connectionFailed) {
		return null;
	}

	if (redis?.isOpen) {
		return redis;
	}

	if (isConnecting) {
		return null;
	}

	try {
		isConnecting = true;
		redis = createClient({
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

		redis.on("error", (err) => {
			console.warn("Aviso Redis:", err?.message || err);
		});

		await redis.connect();
		isConnecting = false;
		connectionFailed = false;
		return redis;
	} catch (error) {
		console.warn(
			"Redis indisponível, prosseguindo sem cache:",
			(error as Error)?.message,
		);
		connectionFailed = true;
		isConnecting = false;
		redis = null;
		return null;
	}
}

export async function getCachedData<T>(key: string): Promise<T | null> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return null;
		const data = await client.get(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error("Erro ao buscar dados do cache:", error);
		return null;
	}
}

export async function setCachedData<T>(
	key: string,
	data: T,
	ttlInSeconds: number = 86400,
): Promise<void> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return;
		await client.setEx(key, ttlInSeconds, JSON.stringify(data));
	} catch (error) {
		console.error("Erro ao salvar dados no cache:", error);
	}
}

export async function deleteCachedData(key: string): Promise<void> {
	try {
		const client = await getRedisClient();
		if (!client?.isOpen) return;
		await client.del(key);
	} catch (error) {
		console.error("Erro ao deletar dados do cache:", error);
	}
}

export const CACHE_KEYS = {
	RADARS: "radars_data",
	CAMERAS: "cameras_data",
} as const;

export const CACHE_TTL = 24 * 60 * 60;
