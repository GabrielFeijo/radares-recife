import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/redis", () => ({
	CACHE_KEYS: {
		RADARS: "radars_data",
		CAMERAS: "cameras_data",
	},
	CACHE_TTL: 86400,
	getCachedData: vi.fn(),
	setCachedData: vi.fn(),
}));

vi.mock("@/lib/ckan", () => ({
	fetchFromCKAN: vi.fn(),
}));

describe("services/camera-service - getCameras", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return cached cameras when Redis returns non-empty array", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");
		const mockCached = [
			{ id: 1, name: "Cam 1", latitude: -8.05, longitude: -34.88 },
		];
		vi.mocked(getCachedData).mockResolvedValue(mockCached);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(result).toBe(mockCached);
		expect(fetchFromCKAN).not.toHaveBeenCalled();
	});

	it("should fetch from CKAN on cache miss, sanitize, filter invalid coords, cache in Redis and return", async () => {
		const { getCachedData, setCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);

		const rawCkanRecords = [
			{
				_id: 201,
				nome: "CÂMERA 01 - DERBY",
				endereco: "Praça do Derby",
				latitude: -8.05678,
				longitude: "-34.89876",
			},
			{
				id: 202,
				nome: "CÂMERA 02",
				latitude: undefined,
				longitude: null,
			},
			{
				nome: "CÂMERA 03",
				latitude: 0,
				longitude: -34.88,
			},
			{
				_id: 203,
				latitude: "invalid",
				longitude: -34.88,
			},
		];

		vi.mocked(fetchFromCKAN).mockResolvedValue(rawCkanRecords as any);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			id: 201,
			name: "CÂMERA 01 - DERBY",
			address: "Praça do Derby",
			latitude: -8.05678,
			longitude: -34.89876,
		});

		expect(setCachedData).toHaveBeenCalledWith("cameras_data", result, 86400);
	});

	it("should fall back to local cameras.json when API returns empty array", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should load fallback from local.result.records when local.records is undefined", async () => {
		vi.doMock("@/data/cameras.json", () => ({
			default: {
				result: {
					records: [
						{
							_id: 301,
							nome: "Câmera Fallback",
							endereco: "Rua Fallback",
							latitude: -8.05,
							longitude: -34.88,
						},
					],
				},
			},
		}));

		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockResolvedValue(null);

		const { fetchFromCKAN } = await import("@/lib/ckan");
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Câmera Fallback");
	});

	it("should fall back to local cameras.json when CKAN fetch fails", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);
		vi.mocked(fetchFromCKAN).mockRejectedValue(new Error("CKAN error"));

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should fall back to local cameras.json when getCachedData throws", async () => {
		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockRejectedValue(new Error("Redis failure"));

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should return empty array when local cameras data has invalid structure", async () => {
		vi.doMock("@/data/cameras.json", () => ({
			default: { records: "not-an-array", result: null },
		}));

		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockResolvedValue(null);

		const { fetchFromCKAN } = await import("@/lib/ckan");
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(result).toEqual([]);
	});

	it("should execute catch block in getLocalCamerasFallback when accessing local data throws", async () => {
		vi.doMock("@/data/cameras.json", () => ({
			default: {
				get records() {
					throw new Error("Getter error");
				},
			},
		}));

		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockResolvedValue(null);

		const { fetchFromCKAN } = await import("@/lib/ckan");
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getCameras } = await import("@/services/camera-service");
		const result = await getCameras();

		expect(result).toEqual([]);
	});
});
