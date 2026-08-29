import { describe, expect, it } from "vitest";
import {
	CKAN_RESOURCE_IDS,
	GEOLOCATION_CONFIG,
	MAP_DEFAULTS,
	MAP_TILES,
	PHOTON_CONFIG,
} from "@/constants/map";

describe("map constants", () => {
	it("should export correct MAP_DEFAULTS", () => {
		expect(MAP_DEFAULTS.center).toEqual([-8.0584, -34.8848]);
		expect(MAP_DEFAULTS.zoom).toBe(13);
		expect(MAP_DEFAULTS.locationZoom).toBe(16);
		expect(MAP_DEFAULTS.searchZoom).toBe(17);
		expect(MAP_DEFAULTS.flyDuration).toBe(1.5);
	});

	it("should export correct MAP_TILES", () => {
		expect(MAP_TILES.GOOGLE_MAPS.url).toContain("google.cn");
	});

	it("should export valid CKAN resource IDs", () => {
		expect(CKAN_RESOURCE_IDS.RADARS).toBe(
			"36c2b47b-f439-4895-8b65-3f3dda36a4a7",
		);
		expect(CKAN_RESOURCE_IDS.CAMERAS).toBe(
			"3d9a7f0d-cb38-48ee-9e10-d9b83284ae28",
		);
	});

	it("should export correct PHOTON_CONFIG", () => {
		expect(PHOTON_CONFIG.bbox).toBe("-35.05,-8.18,-34.85,-7.90");
		expect(PHOTON_CONFIG.limit).toBe(5);
		expect(PHOTON_CONFIG.debounceMs).toBe(400);
		expect(PHOTON_CONFIG.minQueryLength).toBe(3);
	});

	it("should export correct GEOLOCATION_CONFIG", () => {
		expect(GEOLOCATION_CONFIG.enableHighAccuracy).toBe(true);
		expect(GEOLOCATION_CONFIG.timeout).toBe(8000);
	});
});
