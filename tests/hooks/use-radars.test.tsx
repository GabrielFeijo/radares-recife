import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRadars } from "@/hooks/use-radars";
import * as apiClient from "@/services/api-client";
import type { RadarData } from "@/types/radar";

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe("hooks/use-radars", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should start in loading state before data is fetched", () => {
		vi.spyOn(apiClient, "fetchRadarsApi").mockResolvedValue([]);

		const { result } = renderHook(() => useRadars(), {
			wrapper: createWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it("should fetch radars data successfully", async () => {
		const mockRadars: RadarData[] = [{ id: 1, equipmentType: "Radar" } as RadarData];
		vi.spyOn(apiClient, "fetchRadarsApi").mockResolvedValue(mockRadars);

		const { result } = renderHook(() => useRadars(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).toEqual(mockRadars);
	});

	it("should be in error state when the fetch fails", async () => {
		const fetchError = new Error("Falha ao buscar radares");
		vi.spyOn(apiClient, "fetchRadarsApi").mockRejectedValue(fetchError);

		const { result } = renderHook(() => useRadars(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.isSuccess).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(fetchError);
	});

	it("should use the correct query key", () => {
		vi.spyOn(apiClient, "fetchRadarsApi").mockResolvedValue([]);

		const { result } = renderHook(() => useRadars(), {
			wrapper: createWrapper(),
		});

		expect(apiClient.fetchRadarsApi).toHaveBeenCalledTimes(1);
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
		expect(result.current).toHaveProperty("isError");
	});
});
