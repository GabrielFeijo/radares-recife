import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cache/route";
import * as redisLib from "@/lib/redis";

describe("app/api/cache/route", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return available: false when redis is null or not open", async () => {
		vi.spyOn(redisLib, "getRedisClient").mockResolvedValue(null);

		const response = await GET();
		const json = await response.json();

		expect(json.success).toBe(true);
		expect(json.cache_status.available).toBe(false);
		expect(json.cache_status.radars.cached).toBe(false);
		expect(json.cache_status.cameras.cached).toBe(false);
	});

	it("should return full cache status with TTLs when redis is connected and keys exist", async () => {
		const mockClient = {
			isOpen: true,
			exists: vi.fn().mockImplementation((key) => {
				return key === redisLib.CACHE_KEYS.RADARS ? 1 : 1;
			}),
			ttl: vi.fn().mockImplementation((key) => {
				return key === redisLib.CACHE_KEYS.RADARS ? 7200 : 3600;
			}),
		};
		vi.spyOn(redisLib, "getRedisClient").mockResolvedValue(mockClient as any);

		const response = await GET();
		const json = await response.json();

		expect(json.success).toBe(true);
		expect(json.cache_status.radars).toEqual({
			cached: true,
			ttl_seconds: 7200,
			ttl_hours: 2,
		});
		expect(json.cache_status.cameras).toEqual({
			cached: true,
			ttl_seconds: 3600,
			ttl_hours: 1,
		});
	});

	it("should return ttl -1 and hours 0 when keys do not exist in redis", async () => {
		const mockClient = {
			isOpen: true,
			exists: vi.fn().mockResolvedValue(0),
			ttl: vi.fn().mockResolvedValue(-2),
		};
		vi.spyOn(redisLib, "getRedisClient").mockResolvedValue(mockClient as any);

		const response = await GET();
		const json = await response.json();

		expect(json.success).toBe(true);
		expect(json.cache_status.radars.cached).toBe(false);
		expect(json.cache_status.radars.ttl_seconds).toBe(-1);
		expect(json.cache_status.radars.ttl_hours).toBe(0);
	});

	it("should return 500 on unexpected exception", async () => {
		vi.spyOn(redisLib, "getRedisClient").mockRejectedValue(
			new Error("Unexpected error"),
		);

		const response = await GET();
		expect(response.status).toBe(500);

		const json = await response.json();
		expect(json.success).toBe(false);
		expect(json.error).toBe("Erro ao verificar status do cache");
	});
});
