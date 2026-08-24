"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRadarsApi } from "@/services/api-client";

export function useRadars() {
	return useQuery({
		queryKey: ["radars"],
		queryFn: fetchRadarsApi,
	});
}
