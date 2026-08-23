"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";

const QUERY_DEFAULTS = {
	staleTime: 24 * 60 * 60 * 1000,
	gcTime: 24 * 60 * 60 * 1000,
	retry: 1,
	refetchOnWindowFocus: false,
} as const;

export function ReactQueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: QUERY_DEFAULTS,
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
