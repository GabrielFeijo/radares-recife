import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cameras/route";
import * as cameraService from "@/services/camera-service";

describe("app/api/cameras/route", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return 200 with cameras data on success", async () => {
		const mockCameras = [{ id: 10, name: "Camera 10" } as any];
		vi.spyOn(cameraService, "getCameras").mockResolvedValue(mockCameras);

		const response = await GET();
		expect(response.status).toBe(200);

		const json = await response.json();
		expect(json).toEqual({
			success: true,
			data: mockCameras,
		});
	});

	it("should return 500 with error message on exception", async () => {
		vi.spyOn(cameraService, "getCameras").mockRejectedValue(
			new Error("Service error"),
		);

		const response = await GET();
		expect(response.status).toBe(500);

		const json = await response.json();
		expect(json).toEqual({
			success: false,
			data: [],
			error: "Erro ao buscar dados de câmeras",
		});
	});
});
