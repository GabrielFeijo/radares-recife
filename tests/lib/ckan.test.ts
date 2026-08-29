import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchFromCKAN } from "@/lib/ckan";

describe("lib/ckan - fetchFromCKAN", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should fetch all records with single page when records count < 1000", async () => {
		const mockRecords = [{ id: 1, name: "Radar 1" }];
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				success: true,
				result: {
					records: mockRecords,
					total: 1,
				},
			}),
		} as Response);

		const result = await fetchFromCKAN<{ id: number; name: string }>(
			"resource-123",
		);
		expect(result).toEqual(mockRecords);
		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		expect(globalThis.fetch).toHaveBeenCalledWith(
			"https://dados.recife.pe.gov.br/api/action/datastore_search",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					resource_id: "resource-123",
					limit: 1000,
					offset: 0,
				}),
			}),
		);
	});

	it("should paginate correctly when records count equals 1000", async () => {
		const page1 = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
		const page2 = [{ id: 1000 }];

		globalThis.fetch = vi
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					result: { records: page1, total: 1001 },
				}),
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					result: { records: page2, total: 1001 },
				}),
			} as Response);

		const result = await fetchFromCKAN<{ id: number }>("resource-123");
		expect(result.length).toBe(1001);
		expect(globalThis.fetch).toHaveBeenCalledTimes(2);
	});

	it("should throw error when response is not ok", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
		} as Response);

		await expect(fetchFromCKAN("resource-123")).rejects.toThrow(
			"CKAN API error: HTTP 500",
		);
	});

	it("should throw error when CKAN returns success: false or invalid records format", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				success: false,
			}),
		} as Response);

		await expect(fetchFromCKAN("resource-123")).rejects.toThrow(
			"Invalid response format from CKAN API",
		);
	});
});
