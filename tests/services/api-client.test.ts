import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCamerasApi, fetchRadarsApi } from "@/services/api-client";

describe("services/api-client", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchRadarsApi", () => {
		it("should fetch and return radar data when response is ok", async () => {
			const mockRadars = [{ id: 1, equipmentType: "Lombada" }];
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ success: true, data: mockRadars }),
			} as Response);

			const data = await fetchRadarsApi();
			expect(data).toEqual(mockRadars);
			expect(globalThis.fetch).toHaveBeenCalledWith("/api/radars");
		});

		it("should throw error when response is not ok", async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			await expect(fetchRadarsApi()).rejects.toThrow(
				"Erro ao carregar dados de radares",
			);
		});
	});

	describe("fetchCamerasApi", () => {
		it("should fetch and return camera data when response is ok", async () => {
			const mockCameras = [{ id: 10, name: "Cam 1" }];
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ success: true, data: mockCameras }),
			} as Response);

			const data = await fetchCamerasApi();
			expect(data).toEqual(mockCameras);
			expect(globalThis.fetch).toHaveBeenCalledWith("/api/cameras");
		});

		it("should throw error when response is not ok", async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			await expect(fetchCamerasApi()).rejects.toThrow(
				"Erro ao carregar dados de câmeras",
			);
		});
	});
});
