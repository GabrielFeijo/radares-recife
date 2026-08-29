import { act, fireEvent, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAddressSearch } from "@/hooks/use-address-search";
import * as geocodingService from "@/services/geocoding-service";
import type { SearchResult } from "@/types";

describe("hooks/use-address-search", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should debounce address search when query >= 3 characters", async () => {
		const mockResults: SearchResult[] = [
			{
				place_id: "1",
				display_name: "Av. Agamenon Magalhães, Derby, Recife",
				lat: "-8.05",
				lon: "-34.88",
			},
		];
		const searchSpy = vi
			.spyOn(geocodingService, "searchAddressByQuery")
			.mockResolvedValue(mockResults);

		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		act(() => {
			result.current.setQuery("Ag");
		});
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(searchSpy).not.toHaveBeenCalled();

		act(() => {
			result.current.setQuery("Agamenon");
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});

		await act(async () => {
			await Promise.resolve();
		});

		expect(searchSpy).toHaveBeenCalledWith("Agamenon", expect.any(AbortSignal));
		expect(result.current.results).toEqual(mockResults);
		expect(result.current.showResults).toBe(true);
	});

	it("should handle select result callback", () => {
		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		const mockResult: SearchResult = {
			place_id: "1",
			display_name: "Av. Boa Viagem",
			lat: "-8.12",
			lon: "-34.89",
		};

		act(() => {
			result.current.handleSelectResult(mockResult);
		});

		expect(onLocationSelect).toHaveBeenCalledWith(
			-8.12,
			-34.89,
			"Av. Boa Viagem",
		);
		expect(result.current.showResults).toBe(false);
		expect(result.current.results).toEqual([]);
	});

	it("should handle clear action", () => {
		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		act(() => {
			result.current.setQuery("Test");
			result.current.setShowResults(true);
		});

		act(() => {
			result.current.handleClear();
		});

		expect(result.current.query).toBe("");
		expect(result.current.results).toEqual([]);
		expect(result.current.showResults).toBe(false);
	});

	it("should trigger manual search when query >= 3 and not trigger when query < 3", async () => {
		const searchSpy = vi
			.spyOn(geocodingService, "searchAddressByQuery")
			.mockResolvedValue([]);

		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		act(() => {
			result.current.setQuery("Re");
		});
		act(() => {
			result.current.handleSearchManual();
		});
		expect(searchSpy).not.toHaveBeenCalled();

		act(() => {
			result.current.setQuery("Recife");
		});

		act(() => {
			result.current.handleSearchManual();
		});

		await act(async () => {
			await Promise.resolve();
		});

		expect(searchSpy).toHaveBeenCalledWith("Recife", expect.any(AbortSignal));
	});

	it("should close dropdown on Escape key and click outside", () => {
		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		const container = document.createElement("div");
		document.body.appendChild(container);
		(result.current.searchRef as any).current = container;

		act(() => {
			result.current.setShowResults(true);
		});
		expect(result.current.showResults).toBe(true);

		fireEvent.keyDown(document, { key: "Enter" });
		expect(result.current.showResults).toBe(true);

		fireEvent.keyDown(document, { key: "Escape" });
		expect(result.current.showResults).toBe(false);

		act(() => {
			result.current.setShowResults(true);
		});

		fireEvent.mouseDown(container);
		expect(result.current.showResults).toBe(true);

		fireEvent.mouseDown(document.body);
		expect(result.current.showResults).toBe(false);

		(result.current.searchRef as any).current = null;
		act(() => {
			result.current.setShowResults(true);
		});
		fireEvent.mouseDown(document.body);
		expect(result.current.showResults).toBe(true);

		document.body.removeChild(container);
	});

	it("should handle AbortError and generic network errors gracefully", async () => {
		const abortError = new Error("Aborted");
		abortError.name = "AbortError";

		vi.spyOn(geocodingService, "searchAddressByQuery")
			.mockRejectedValueOnce(abortError)
			.mockRejectedValueOnce(new Error("Network Error"));

		const onLocationSelect = vi.fn();
		const { result } = renderHook(() => useAddressSearch(onLocationSelect));

		act(() => {
			result.current.setQuery("AbortQuery");
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});
		await act(async () => {
			await Promise.resolve();
		});

		act(() => {
			result.current.setQuery("ErrorQuery");
		});
		act(() => {
			vi.advanceTimersByTime(400);
		});
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.results).toEqual([]);
		expect(result.current.isLoading).toBe(false);
	});
});
