import { describe, expect, it } from "vitest";
import { getSpeedBadgeInfo, parseSpeedParts } from "@/utils/speed";

describe("speed utils", () => {
	describe("parseSpeedParts", () => {
		it("should return fallback when speed is undefined or empty", () => {
			expect(parseSpeedParts()).toEqual({ value: "Radar", unit: "" });
			expect(parseSpeedParts("")).toEqual({ value: "Radar", unit: "" });
			expect(parseSpeedParts("   ")).toEqual({ value: "Radar", unit: "" });
		});

		it("should parse dual speeds formatted with 'e'", () => {
			expect(parseSpeedParts("60 km/h e 40 km/h")).toEqual({
				value: "60 / 40",
				unit: "km/h",
			});
			expect(parseSpeedParts("50kmh e 30kmh")).toEqual({
				value: "50 / 30",
				unit: "km/h",
			});
			expect(parseSpeedParts("60 e 40")).toEqual({
				value: "60 / 40",
				unit: "km/h",
			});
		});

		it("should parse standard single speed", () => {
			expect(parseSpeedParts("60 km/h")).toEqual({
				value: "60",
				unit: "km/h",
			});
			expect(parseSpeedParts("40kmh")).toEqual({
				value: "40",
				unit: "km/h",
			});
			expect(parseSpeedParts("50")).toEqual({
				value: "50",
				unit: "km/h",
			});
		});

		it("should handle strings that become empty after removing km/h", () => {
			expect(parseSpeedParts("km/h")).toEqual({
				value: "km/h",
				unit: "km/h",
			});
		});
	});

	describe("getSpeedBadgeInfo", () => {
		it("should return text-xs for fallback radar when unit is empty", () => {
			expect(getSpeedBadgeInfo()).toEqual({
				value: "Radar",
				unit: "",
				textSize: "text-xs",
			});
			expect(getSpeedBadgeInfo("")).toEqual({
				value: "Radar",
				unit: "",
				textSize: "text-xs",
			});
		});

		it("should calculate correct text sizes based on value length", () => {
			expect(getSpeedBadgeInfo("100 / 80 km/h")).toEqual({
				value: "100 / 80",
				unit: "km/h",
				textSize: "text-[8.5px]",
			});

			expect(getSpeedBadgeInfo("60 / 40 km/h")).toEqual({
				value: "60 / 40",
				unit: "km/h",
				textSize: "text-[9.5px]",
			});
			expect(getSpeedBadgeInfo("60/40 km/h")).toEqual({
				value: "60/40",
				unit: "km/h",
				textSize: "text-[9.5px]",
			});

			expect(getSpeedBadgeInfo("100 km/h")).toEqual({
				value: "100",
				unit: "km/h",
				textSize: "text-xs",
			});

			expect(getSpeedBadgeInfo("60 km/h")).toEqual({
				value: "60",
				unit: "km/h",
				textSize: "text-sm",
			});
			expect(getSpeedBadgeInfo("5 km/h")).toEqual({
				value: "5",
				unit: "km/h",
				textSize: "text-sm",
			});
		});
	});
});
