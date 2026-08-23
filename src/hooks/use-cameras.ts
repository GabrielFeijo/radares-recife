"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, CameraData } from "@/types";

export function useCameras() {
	return useQuery({
		queryKey: ["cameras"],
		queryFn: async () => {
			const response = await fetch("/api/cameras");
			if (!response.ok) throw new Error("Erro ao carregar dados de câmeras");
			const json: ApiResponse<CameraData> = await response.json();
			return json.data;
		},
	});
}
