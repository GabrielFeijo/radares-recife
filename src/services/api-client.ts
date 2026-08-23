import type { ApiResponse, CameraData, RadarData } from "@/types";

export async function fetchRadarsApi(): Promise<RadarData[]> {
	const response = await fetch("/api/radars");
	if (!response.ok) {
		throw new Error("Erro ao carregar dados de radares");
	}
	const json: ApiResponse<RadarData> = await response.json();
	return json.data;
}

export async function fetchCamerasApi(): Promise<CameraData[]> {
	const response = await fetch("/api/cameras");
	if (!response.ok) {
		throw new Error("Erro ao carregar dados de câmeras");
	}
	const json: ApiResponse<CameraData> = await response.json();
	return json.data;
}
