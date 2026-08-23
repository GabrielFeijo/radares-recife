"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, RadarData } from "@/types";

export function useRadars() {
	return useQuery({
		queryKey: ["radars"],
		queryFn: async () => {
			const response = await fetch("/api/radars");
			if (!response.ok) throw new Error("Erro ao carregar dados de radares");
			const json: ApiResponse<RadarData> = await response.json();
			return json.data;
		},
	});
}
