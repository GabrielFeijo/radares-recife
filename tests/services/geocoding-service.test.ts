import { afterEach, describe, expect, it, vi } from "vitest";
import { searchAddressByQuery } from "@/services/geocoding-service";

describe("services/geocoding-service - searchAddressByQuery", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should search addresses and map results with district, city, and state", async () => {
		const mockPhotonResponse = {
			features: [
				{
					geometry: { coordinates: [-34.88, -8.05] },
					properties: {
						osm_id: 12345,
						name: "Avenida Agamenon Magalhães",
						district: "Derby",
						city: "Recife",
						state: "Pernambuco",
					},
				},
				{
					geometry: { coordinates: [-34.9, -8.06] },
					properties: {
						street: "Rua do Futuro",
						locality: "Graças",
					},
				},
				{
					geometry: { coordinates: [-34.91, -8.07] },
					properties: {},
				},
			],
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPhotonResponse,
		} as Response);

		const results = await searchAddressByQuery("Agamenon");
		expect(results).toHaveLength(3);

		expect(results[0]).toEqual({
			place_id: "12345",
			display_name: "Avenida Agamenon Magalhães, Derby, Recife, Pernambuco",
			lat: "-8.05",
			lon: "-34.88",
		});

		expect(results[1]).toEqual({
			place_id: "street-1",
			display_name: "Rua do Futuro, Graças",
			lat: "-8.06",
			lon: "-34.9",
		});

		expect(results[2]).toEqual({
			place_id: "street-2",
			display_name: "Via sem nome, Recife - Pernambuco",
			lat: "-8.07",
			lon: "-34.91",
		});
	});

	it("should deduplicate results with the same title and subtitle", async () => {
		const mockPhotonResponse = {
			features: [
				{
					geometry: { coordinates: [-34.88, -8.05] },
					properties: {
						osm_id: 1,
						name: "Avenida Conde da Boa Vista",
						district: "Boa Vista",
						city: "Recife",
					},
				},
				{
					geometry: { coordinates: [-34.89, -8.05] },
					properties: {
						osm_id: 2,
						name: "Avenida Conde da Boa Vista",
						district: "Boa Vista",
						city: "Recife",
					},
				},
			],
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPhotonResponse,
		} as Response);

		const results = await searchAddressByQuery("Conde");
		expect(results).toHaveLength(1);
		expect(results[0].place_id).toBe("1");
	});

	it("should respect limit of PHOTON_CONFIG.limit (5 items)", async () => {
		const mockPhotonResponse = {
			features: Array.from({ length: 10 }, (_, i) => ({
				geometry: { coordinates: [-34.88, -8.05 - i * 0.01] },
				properties: {
					osm_id: i + 1,
					name: `Rua Teste ${i}`,
					city: "Recife",
				},
			})),
		};

		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPhotonResponse,
		} as Response);

		const results = await searchAddressByQuery("Rua");
		expect(results).toHaveLength(5);
	});

	it("should handle empty features array", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ features: null }),
		} as Response);

		const results = await searchAddressByQuery("Inexistente");
		expect(results).toEqual([]);
	});

	it("should throw error on non-ok HTTP response", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 503,
		} as Response);

		await expect(searchAddressByQuery("Teste")).rejects.toThrow(
			"Photon geocoding error: HTTP 503",
		);
	});
});
