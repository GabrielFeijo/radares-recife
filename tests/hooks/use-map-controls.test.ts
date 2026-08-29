import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMapControls } from "@/hooks/use-map-controls";
import type { RadarData } from "@/types";

const mockRadars: RadarData[] = [
	{
		id: 1,
		equipmentType: "Radar",
		inmetroRegistration: "",
		manufacturerSerialNumber: "",
		equipmentIdentification: "1",
		installationLocation: "Loc 1",
		monitoringDirection: "Norte",
		latitude: -8.05,
		longitude: -34.88,
		monitoredLanes: 2,
		monitoredSpeed: "60 km/h",
		vmd: 1000,
		vmdPeriod: "2024",
	},
	{
		id: 2,
		equipmentType: "Lombada",
		inmetroRegistration: "",
		manufacturerSerialNumber: "",
		equipmentIdentification: "2",
		installationLocation: "Loc 2",
		monitoringDirection: "Sul",
		latitude: -8.06,
		longitude: -34.89,
		monitoredLanes: 1,
		monitoredSpeed: "40 km/h",
		vmd: 500,
		vmdPeriod: "2024",
	},
	{
		id: 3,
		equipmentType: "Lombada",
		inmetroRegistration: "",
		manufacturerSerialNumber: "",
		equipmentIdentification: "3",
		installationLocation: "Loc 3",
		monitoringDirection: "Leste",
		latitude: -8.07,
		longitude: -34.9,
		monitoredLanes: 1,
		monitoredSpeed: "60 km/h",
		vmd: 800,
		vmdPeriod: "2024",
	},
	{
		id: 4,
		equipmentType: "Sem Velocidade",
		inmetroRegistration: "",
		manufacturerSerialNumber: "",
		equipmentIdentification: "4",
		installationLocation: "Loc 4",
		monitoringDirection: "",
		latitude: -8.08,
		longitude: -34.91,
		monitoredLanes: 1,
		monitoredSpeed: "",
		vmd: 0,
		vmdPeriod: "",
	},
];

describe("hooks/use-map-controls", () => {
	it("should initialize with default states and extract available speeds sorted", () => {
		const { result } = renderHook(() => useMapControls(mockRadars));

		expect(result.current.showRadars).toBe(true);
		expect(result.current.showCameras).toBe(false);
		expect(result.current.showSpeedLabels).toBe(false);
		expect(result.current.selectedSpeed).toBe("all");
		expect(result.current.showSpeedFilter).toBe(false);

		expect(result.current.availableSpeeds).toEqual(["40 km/h", "60 km/h"]);
		expect(result.current.filteredRadars).toEqual(mockRadars);
	});

	it("should toggle radar visibility", () => {
		const { result } = renderHook(() => useMapControls(mockRadars));

		act(() => {
			result.current.toggleRadars();
		});
		expect(result.current.showRadars).toBe(false);

		act(() => {
			result.current.toggleRadars();
		});
		expect(result.current.showRadars).toBe(true);
	});

	it("should toggle cameras, speed labels, and speed filter", () => {
		const { result } = renderHook(() => useMapControls(mockRadars));

		act(() => {
			result.current.toggleCameras();
			result.current.toggleSpeedLabels();
			result.current.toggleSpeedFilter();
		});

		expect(result.current.showCameras).toBe(true);
		expect(result.current.showSpeedLabels).toBe(true);
		expect(result.current.showSpeedFilter).toBe(true);
	});

	it("should filter radars by selected speed", () => {
		const { result } = renderHook(() => useMapControls(mockRadars));

		act(() => {
			result.current.selectSpeed("60 km/h");
		});

		expect(result.current.selectedSpeed).toBe("60 km/h");
		expect(result.current.filteredRadars).toHaveLength(2);
		expect(result.current.filteredRadars.map((r) => r.id)).toEqual([1, 3]);

		act(() => {
			result.current.selectSpeed("40 km/h");
		});

		expect(result.current.filteredRadars).toHaveLength(1);
		expect(result.current.filteredRadars[0].id).toBe(2);

		act(() => {
			result.current.selectSpeed("all");
		});

		expect(result.current.filteredRadars).toEqual(mockRadars);
	});
});
