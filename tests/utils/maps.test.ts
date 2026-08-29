import { describe, expect, it } from "vitest";
import {
	formatCoordinates,
	getDirectionsUrl,
	getStreetViewUrl,
} from "@/utils/maps";

describe("maps utils", () => {
	it("should generate valid Google Street View URL", () => {
		const url = getStreetViewUrl(-8.0584, -34.8848);
		expect(url).toBe(
			"https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-8.0584,-34.8848",
		);
	});

	it("should generate valid Google Directions URL", () => {
		const url = getDirectionsUrl(-8.0584, -34.8848);
		expect(url).toBe(
			"https://www.google.com/maps/dir/?api=1&destination=-8.0584,-34.8848",
		);
	});

	it("should format coordinates with default precision of 5", () => {
		const formatted = formatCoordinates(-8.05841234, -34.88489876);
		expect(formatted).toBe("-8.05841, -34.88490");
	});

	it("should format coordinates with custom precision", () => {
		const formatted = formatCoordinates(-8.05841234, -34.88489876, 2);
		expect(formatted).toBe("-8.06, -34.88");
	});
});
