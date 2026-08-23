"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCamerasApi } from "@/services/api-client";

export function useCameras() {
	return useQuery({
		queryKey: ["cameras"],
		queryFn: fetchCamerasApi,
	});
}
