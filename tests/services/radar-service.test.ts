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

describe("services/radar-service - getRadars", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return cached radars when Redis returns non-empty array", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");
		const mockCached = [
			{ id: 1, equipmentType: "Lombada", latitude: -8.05, longitude: -34.88 },
		];
		vi.mocked(getCachedData).mockResolvedValue(mockCached);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(result).toBe(mockCached);
		expect(fetchFromCKAN).not.toHaveBeenCalled();
	});

	it("should fetch from CKAN on cache miss, sanitize, filter invalid coords, cache in Redis and return", async () => {
		const { getCachedData, setCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);

		const rawCkanRecords = [
			{
				_id: 101,
				tipo_equipamento: "Lombada Eletrônica",
				registro_inmetro: "INM-123",
				numero_serie_fabricante: "SER-456",
				identificacao_equipamento: "EQ-789",
				local_instalacao: "Av. Boa Viagem",
				sentido_fiscalizacao: "Centro",
				latitude: "-8.12345",
				longitude: -34.89123,
				faixas_fiscalizadas: "2",
				velocidade_fiscalizada: "50 km/h",
				vmd: "12000",
				periodo_vmd: "2024",
			},
			{
				_id: 102,
				tipo_equipamento: "Radar",
				latitude: -8.05,
				longitude: 0,
				faixas_fiscalizadas: "NaN",
				vmd: "invalid",
			},
			{
				_id: 103,
				latitude: 0,
				longitude: -34.88,
			},
			{
				_id: 104,
				latitude: "invalid",
				longitude: -34.88,
			},
		];

		vi.mocked(fetchFromCKAN).mockResolvedValue(rawCkanRecords as any);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			id: 101,
			equipmentType: "Lombada Eletrônica",
			inmetroRegistration: "INM-123",
			manufacturerSerialNumber: "SER-456",
			equipmentIdentification: "EQ-789",
			installationLocation: "Av. Boa Viagem",
			monitoringDirection: "Centro",
			latitude: -8.12345,
			longitude: -34.89123,
			monitoredLanes: 2,
			monitoredSpeed: "50 km/h",
			vmd: 12000,
			vmdPeriod: "2024",
		});

		expect(setCachedData).toHaveBeenCalledWith("radars_data", result, 86400);
	});

	it("should fall back to local radars.json when API returns empty array", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should fall back to local radars.json when CKAN fetch fails", async () => {
		const { getCachedData } = await import("@/lib/redis");
		const { fetchFromCKAN } = await import("@/lib/ckan");

		vi.mocked(getCachedData).mockResolvedValue(null);
		vi.mocked(fetchFromCKAN).mockRejectedValue(
			new Error("CKAN connection failed"),
		);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should fall back to local radars.json when getCachedData throws", async () => {
		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockRejectedValue(new Error("Redis get error"));

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should return empty array when local radars data has invalid structure", async () => {
		vi.doMock("@/data/radars.json", () => ({
			default: { result: { records: "not-an-array" } },
		}));

		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockResolvedValue(null);

		const { fetchFromCKAN } = await import("@/lib/ckan");
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(result).toEqual([]);
	});

	it("should execute catch block in getLocalRadarsFallback when accessing local data throws", async () => {
		vi.doMock("@/data/radars.json", () => ({
			default: {
				get result() {
					throw new Error("Getter error");
				},
			},
		}));

		const { getCachedData } = await import("@/lib/redis");
		vi.mocked(getCachedData).mockResolvedValue(null);

		const { fetchFromCKAN } = await import("@/lib/ckan");
		vi.mocked(fetchFromCKAN).mockResolvedValue([]);

		const { getRadars } = await import("@/services/radar-service");
		const result = await getRadars();

		expect(result).toEqual([]);
	});
});
