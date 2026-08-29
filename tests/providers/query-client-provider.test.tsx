import { useQuery, useQueryClient } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { ReactQueryClientProvider } from "@/providers/query-client-provider";

describe("providers/query-client-provider", () => {
	it("should render children correctly wrapped in QueryClientProvider", () => {
		render(
			<ReactQueryClientProvider>
				<div data-testid="child-element">Child Content</div>
			</ReactQueryClientProvider>,
		);

		expect(screen.getByTestId("child-element")).toBeInTheDocument();
		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});

	it("should provide a functioning QueryClient context to child hooks", async () => {
		const fetchFn = vi.fn().mockResolvedValue({ value: 42 });

		function TestConsumer() {
			const { data, isSuccess } = useQuery({
				queryKey: ["provider-test"],
				queryFn: fetchFn,
			});
			if (!isSuccess) return <span>loading</span>;
			return <span data-testid="result">{(data as { value: number }).value}</span>;
		}

		render(
			<ReactQueryClientProvider>
				<TestConsumer />
			</ReactQueryClientProvider>,
		);

		await waitFor(() =>
			expect(screen.getByTestId("result")).toBeInTheDocument(),
		);
		expect(screen.getByTestId("result")).toHaveTextContent("42");
		expect(fetchFn).toHaveBeenCalledTimes(1);
	});

	it("should apply the configured staleTime and retry defaults", async () => {
		let capturedClient: ReturnType<typeof useQueryClient> | null = null;

		function ClientCaptor() {
			capturedClient = useQueryClient();
			return null;
		}

		render(
			<ReactQueryClientProvider>
				<ClientCaptor />
			</ReactQueryClientProvider>,
		);

		await waitFor(() => expect(capturedClient).not.toBeNull());

		const defaults = capturedClient!.getDefaultOptions().queries;
		expect(defaults?.staleTime).toBe(24 * 60 * 60 * 1000);
		expect(defaults?.retry).toBe(1);
		expect(defaults?.refetchOnWindowFocus).toBe(false);
	});

	it("should maintain a stable QueryClient instance across re-renders", async () => {
		let capturedClient1: ReturnType<typeof useQueryClient> | null = null;
		let capturedClient2: ReturnType<typeof useQueryClient> | null = null;
		let renderCount = 0;

		function ClientCaptor() {
			const client = useQueryClient();
			renderCount++;
			if (renderCount === 1) capturedClient1 = client;
			else capturedClient2 = client;
			return null;
		}

		const { rerender } = render(
			<ReactQueryClientProvider>
				<ClientCaptor />
			</ReactQueryClientProvider>,
		);

		rerender(
			<ReactQueryClientProvider>
				<ClientCaptor />
			</ReactQueryClientProvider>,
		);

		await waitFor(() => expect(capturedClient1).not.toBeNull());
		expect(capturedClient1).toBe(capturedClient2);
	});
});
