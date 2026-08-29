import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCameras } from "@/hooks/use-cameras";
import * as apiClient from "@/services/api-client";

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

	it("should fetch cameras data successfully", async () => {
		const mockCameras = [{ id: 10, name: "Cam 1" } as any];
		vi.spyOn(apiClient, "fetchCamerasApi").mockResolvedValue(mockCameras);

		const { result } = renderHook(() => useCameras(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(mockCameras);
	});
});
