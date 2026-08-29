import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("redis", () => {
	return {
		createClient: vi.fn(),
	};
});

describe("lib/redis", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
		vi.restoreAllMocks();
	});

	it("should return null if REDIS_URL is not set", async () => {
		delete process.env.REDIS_URL;
		const { getRedisClient } = await import("@/lib/redis");
		const client = await getRedisClient();
		expect(client).toBeNull();
	});

	it("should connect and return redis client when REDIS_URL is provided and trigger on error handler", async () => {
		process.env.REDIS_URL = "redis://localhost:6379";
		const { createClient } = await import("redis");
		let errorHandler: () => void = () => {};

		const mockClient = {
			on: vi.fn().mockImplementation((event, handler) => {
				if (event === "error") errorHandler = handler;
			}),
			connect: vi.fn().mockResolvedValue(undefined),
			isOpen: true,
			get: vi.fn(),
			setEx: vi.fn(),
			del: vi.fn(),
		};
		vi.mocked(createClient).mockReturnValue(mockClient as any);

		const { getRedisClient } = await import("@/lib/redis");
		const client = await getRedisClient();

		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({
				url: "redis://localhost:6379",
			}),
		);
		expect(client).toBe(mockClient);

		expect(() => errorHandler()).not.toThrow();

		const client2 = await getRedisClient();
		expect(client2).toBe(mockClient);
	});

	it("should deduplicate concurrent connection attempts", async () => {
		process.env.REDIS_URL = "redis://localhost:6379";
		const { createClient } = await import("redis");
		let connectResolve: () => void = () => {};
		const connectPromise = new Promise<void>((resolve) => {
			connectResolve = resolve;
		});

		const mockClient = {
			on: vi.fn(),
			connect: vi.fn().mockImplementation(() => connectPromise),
			isOpen: true,
		};
		vi.mocked(createClient).mockReturnValue(mockClient as any);

		const { getRedisClient } = await import("@/lib/redis");
		const promise1 = getRedisClient();
		const promise2 = getRedisClient();

		connectResolve();
		const [res1, res2] = await Promise.all([promise1, promise2]);

		expect(res1).toBe(mockClient);
		expect(res2).toBe(mockClient);
		expect(createClient).toHaveBeenCalledTimes(1);
	});

	it("should test reconnectStrategy and connection error handling", async () => {
		process.env.REDIS_URL = "redis://localhost:6379";
		const { createClient } = await import("redis");
		let reconnectFn: (retries: number) => number | false = () => false;

		vi.mocked(createClient).mockImplementation((opts: any) => {
			reconnectFn = opts.socket.reconnectStrategy;
			return {
				on: vi.fn(),
				connect: vi.fn().mockRejectedValue(new Error("Connection error")),
			} as any;
		});

		const { getRedisClient } = await import("@/lib/redis");
		const client = await getRedisClient();
		expect(client).toBeNull();

		expect(reconnectFn?.(1)).toBe(1000);
		expect(reconnectFn?.(2)).toBe(1000);
		expect(reconnectFn?.(3)).toBe(false);

		const clientAgain = await getRedisClient();
		expect(clientAgain).toBeNull();
	});

	it("should reset connectionFailedAt after 5 minutes timeout", async () => {
		process.env.REDIS_URL = "redis://localhost:6379";
		const { createClient } = await import("redis");
		const now = Date.now();
		vi.spyOn(Date, "now").mockReturnValue(now);

		vi.mocked(createClient).mockReturnValueOnce({
			on: vi.fn(),
			connect: vi.fn().mockRejectedValue(new Error("Initial fail")),
		} as any);

		const { getRedisClient } = await import("@/lib/redis");
		await getRedisClient();

		vi.spyOn(Date, "now").mockReturnValue(now + 6 * 60 * 1000);

		const mockSuccessClient = {
			on: vi.fn(),
			connect: vi.fn().mockResolvedValue(undefined),
			isOpen: true,
		};
		vi.mocked(createClient).mockReturnValueOnce(mockSuccessClient as any);

		const client = await getRedisClient();
		expect(client).toBe(mockSuccessClient);
	});

	describe("cache operations", () => {
		it("should getCachedData successfully when key exists and return null when key does not exist", async () => {
			process.env.REDIS_URL = "redis://localhost:6379";
			const { createClient } = await import("redis");
			const mockClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: true,
				get: vi
					.fn()
					.mockResolvedValueOnce(JSON.stringify({ test: "data" }))
					.mockResolvedValueOnce(null),
			};
			vi.mocked(createClient).mockReturnValue(mockClient as any);

			const { getCachedData } = await import("@/lib/redis");
			const data = await getCachedData<{ test: string }>("key1");
			expect(data).toEqual({ test: "data" });

			const nullData = await getCachedData("non-existent-key");
			expect(nullData).toBeNull();
		});

		it("should return null for getCachedData if client is null or key does not exist", async () => {
			delete process.env.REDIS_URL;
			const { getCachedData } = await import("@/lib/redis");
			expect(await getCachedData("key1")).toBeNull();

			process.env.REDIS_URL = "redis://localhost:6379";
			const { createClient } = await import("redis");
			const mockClosedClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: false,
			};
			vi.mocked(createClient).mockReturnValue(mockClosedClient as any);
			vi.resetModules();
			const { getCachedData: getCachedDataClosed } = await import(
				"@/lib/redis"
			);
			expect(await getCachedDataClosed("key1")).toBeNull();

			const mockClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: true,
				get: vi.fn().mockResolvedValue("invalid-json{"),
			};
			vi.mocked(createClient).mockReturnValue(mockClient as any);
			vi.resetModules();
			const { getCachedData: getCachedData2 } = await import("@/lib/redis");
			expect(await getCachedData2("key1")).toBeNull();
		});

		it("should setCachedData with default and custom TTL and handle closed client", async () => {
			process.env.REDIS_URL = "redis://localhost:6379";
			const { createClient } = await import("redis");
			const mockClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: true,
				setEx: vi.fn().mockResolvedValue("OK"),
			};
			vi.mocked(createClient).mockReturnValue(mockClient as any);

			const { setCachedData } = await import("@/lib/redis");
			await setCachedData("key1", { a: 1 });
			expect(mockClient.setEx).toHaveBeenCalledWith("key1", 86400, '{"a":1}');

			await setCachedData("key1", { a: 1 }, 3600);
			expect(mockClient.setEx).toHaveBeenCalledWith("key1", 3600, '{"a":1}');

			mockClient.isOpen = false;
			await setCachedData("key1", { a: 1 });
			expect(mockClient.setEx).toHaveBeenCalledTimes(2);
		});

		it("should handle error in setCachedData and log warning", async () => {
			process.env.REDIS_URL = "redis://localhost:6379";
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const { createClient } = await import("redis");
			const mockClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: true,
				setEx: vi.fn().mockRejectedValue(new Error("Write error")),
			};
			vi.mocked(createClient).mockReturnValue(mockClient as any);

			const { setCachedData } = await import("@/lib/redis");
			await setCachedData("key1", { a: 1 });
			expect(warnSpy).toHaveBeenCalled();
		});

		it("should deleteCachedData successfully and handle closed client or errors", async () => {
			process.env.REDIS_URL = "redis://localhost:6379";
			const { createClient } = await import("redis");
			const mockClient = {
				on: vi.fn(),
				connect: vi.fn().mockResolvedValue(undefined),
				isOpen: true,
				del: vi.fn().mockResolvedValue(1),
			};
			vi.mocked(createClient).mockReturnValue(mockClient as any);

			const { deleteCachedData } = await import("@/lib/redis");
			await deleteCachedData("key1");
			expect(mockClient.del).toHaveBeenCalledWith("key1");

			mockClient.isOpen = false;
			await deleteCachedData("key1");

			mockClient.isOpen = true;
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			mockClient.del.mockRejectedValueOnce(new Error("Del error"));
			await deleteCachedData("key1");
			expect(warnSpy).toHaveBeenCalled();
		});

		it("should export CACHE_KEYS and CACHE_TTL", async () => {
			const { CACHE_KEYS, CACHE_TTL } = await import("@/lib/redis");
			expect(CACHE_KEYS.RADARS).toBe("radars_data");
			expect(CACHE_KEYS.CAMERAS).toBe("cameras_data");
			expect(CACHE_TTL).toBe(86400);
		});
	});
});
