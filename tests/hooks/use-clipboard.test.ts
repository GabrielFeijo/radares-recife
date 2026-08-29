import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "@/hooks/use-clipboard";

describe("hooks/use-clipboard", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should copy text to clipboard and reset copied state after timeout", async () => {
		const writeTextMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: writeTextMock },
			writable: true,
		});

		const { result } = renderHook(() => useClipboard(1500));
		expect(result.current.copied).toBe(false);

		let success = false;
		await act(async () => {
			success = await result.current.copy("test string");
		});

		expect(success).toBe(true);
		expect(writeTextMock).toHaveBeenCalledWith("test string");
		expect(result.current.copied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1500);
		});

		expect(result.current.copied).toBe(false);
	});

	it("should return false when clipboard.writeText fails", async () => {
		const writeTextMock = vi
			.fn()
			.mockRejectedValue(new Error("Permission denied"));
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: writeTextMock },
			writable: true,
		});

		const { result } = renderHook(() => useClipboard());

		let success = true;
		await act(async () => {
			success = await result.current.copy("failed string");
		});

		expect(success).toBe(false);
		expect(result.current.copied).toBe(false);
	});
});
