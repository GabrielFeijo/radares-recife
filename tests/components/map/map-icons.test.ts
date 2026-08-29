import { describe, expect, it } from "vitest";
import {
	cameraIcon,
	createCameraClusterIcon,
	createRadarClusterIcon,
	getRadarDivIcon,
	searchIcon,
	userLocationIcon,
} from "@/components/map/map-icons";

describe("components/map/map-icons", () => {
	it("should create and cache radar div icons", () => {
		const icon1 = getRadarDivIcon("60 km/h", true);
		expect(icon1.options.className).toBe("radar-custom-marker-wrapper");
		expect(icon1.options.html).toContain("60");
		expect(icon1.options.html).toContain("has-label");

		const icon2 = getRadarDivIcon("60 km/h", true);
		expect(icon2).toBe(icon1);

		const icon3 = getRadarDivIcon("60 km/h", false);
		expect(icon3).not.toBe(icon1);
		expect(icon3.options.html).not.toContain("has-label");
	});

	it("should export valid predefined leaflet icons", () => {
		expect(cameraIcon.options.iconSize).toEqual([34, 42]);
		expect(searchIcon.options.iconSize).toEqual([34, 42]);
		expect(userLocationIcon.options.iconSize).toEqual([44, 44]);
	});

	it("should create radar cluster icons based on count", () => {
		const clusterSmall = { getChildCount: () => 5 } as any;
		const clusterMed = { getChildCount: () => 25 } as any;
		const clusterLarge = { getChildCount: () => 150 } as any;

		const iconSmall = createRadarClusterIcon(clusterSmall);
		const iconMed = createRadarClusterIcon(clusterMed);
		const iconLarge = createRadarClusterIcon(clusterLarge);

		expect(iconSmall.options.html).toContain(
			'style="width:36px; height:36px;"',
		);
		expect(iconSmall.options.html).toContain(">5<");

		expect(iconMed.options.html).toContain('style="width:40px; height:40px;"');
		expect(iconMed.options.html).toContain(">25<");

		expect(iconLarge.options.html).toContain(
			'style="width:44px; height:44px;"',
		);
		expect(iconLarge.options.html).toContain(">150<");
	});

	it("should create camera cluster icons based on count", () => {
		const clusterSmall = { getChildCount: () => 8 } as any;
		const clusterMed = { getChildCount: () => 50 } as any;
		const clusterLarge = { getChildCount: () => 200 } as any;

		const iconSmall = createCameraClusterIcon(clusterSmall);
		const iconMed = createCameraClusterIcon(clusterMed);
		const iconLarge = createCameraClusterIcon(clusterLarge);

		expect(iconSmall.options.html).toContain(
			'style="width:36px; height:36px;"',
		);
		expect(iconSmall.options.className).toBe("camera-cluster-container");
		expect(iconMed.options.html).toContain('style="width:40px; height:40px;"');
		expect(iconLarge.options.html).toContain(
			'style="width:44px; height:44px;"',
		);
	});
});
