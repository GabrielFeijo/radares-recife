import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRadars } from "@/hooks/use-radars";
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

describe("hooks/use-radars", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should fetch radars data successfully", async () => {
		const mockRadars = [{ id: 1, equipmentType: "Radar" } as any];
		vi.spyOn(apiClient, "fetchRadarsApi").mockResolvedValue(mockRadars);

		const { result } = renderHook(() => useRadars(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toEqual(mockRadars);
	});
});
