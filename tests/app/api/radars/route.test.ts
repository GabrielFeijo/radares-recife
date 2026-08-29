import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/radars/route";
import * as radarService from "@/services/radar-service";

describe("app/api/radars/route", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return 200 with radars data on success", async () => {
		const mockRadars = [{ id: 1, equipmentType: "Radar" } as any];
		vi.spyOn(radarService, "getRadars").mockResolvedValue(mockRadars);

		const response = await GET();
		expect(response.status).toBe(200);

		const json = await response.json();
		expect(json).toEqual({
			success: true,
			data: mockRadars,
		});
	});

	it("should return 500 with error message on exception", async () => {
		vi.spyOn(radarService, "getRadars").mockRejectedValue(
			new Error("Service error"),
		);

		const response = await GET();
		expect(response.status).toBe(500);

		const json = await response.json();
		expect(json).toEqual({
			success: false,
			data: [],
			error: "Erro ao buscar dados de radares",
		});
	});
});
