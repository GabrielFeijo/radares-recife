import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCameras } from "@/hooks/use-cameras";
import * as apiClient from "@/services/api-client";
import type { CameraData } from "@/types/camera";

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

describe("hooks/use-cameras", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should start in loading state before data is fetched", () => {
		vi.spyOn(apiClient, "fetchCamerasApi").mockResolvedValue([]);

		const { result } = renderHook(() => useCameras(), {
			wrapper: createWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it("should fetch cameras data successfully", async () => {
		const mockCameras: CameraData[] = [{ id: 10, name: "Cam 1" } as CameraData];
		vi.spyOn(apiClient, "fetchCamerasApi").mockResolvedValue(mockCameras);

		const { result } = renderHook(() => useCameras(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).toEqual(mockCameras);
	});

	it("should be in error state when the fetch fails", async () => {
		const fetchError = new Error("Falha ao buscar câmeras");
		vi.spyOn(apiClient, "fetchCamerasApi").mockRejectedValue(fetchError);

		const { result } = renderHook(() => useCameras(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(result.current.isSuccess).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(fetchError);
	});

	it("should use the correct query key", () => {
		vi.spyOn(apiClient, "fetchCamerasApi").mockResolvedValue([]);

		const { result } = renderHook(() => useCameras(), {
			wrapper: createWrapper(),
		});

		expect(apiClient.fetchCamerasApi).toHaveBeenCalledTimes(1);
		expect(result.current).toHaveProperty("data");
		expect(result.current).toHaveProperty("isLoading");
		expect(result.current).toHaveProperty("isError");
	});
});
