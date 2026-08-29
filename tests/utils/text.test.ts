import { describe, expect, it } from "vitest";
import { sanitizeText } from "@/utils/text";

describe("text utils - sanitizeText", () => {
	it("should return empty string for falsy values", () => {
		expect(sanitizeText("")).toBe("");
		expect(sanitizeText(null as unknown as string)).toBe("");
		expect(sanitizeText(undefined as unknown as string)).toBe("");
	});

	it("should fix corrupted characters in Portuguese open data", () => {
		expect(sanitizeText("AV. AGAMENÖN MAGALHÀES")).toBe(
			"AV. AGAMENÍN MAGALHÀES",
		);
		expect(sanitizeText("Ö ö à §")).toBe("Í í Á º");
	});

	it("should collapse multiple whitespace and trim", () => {
		expect(sanitizeText("  Rua   do   Futuro   ")).toBe("Rua do Futuro");
	});
});
