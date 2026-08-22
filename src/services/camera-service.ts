import localCamerasData from "@/data/cameras.json";
import { fetchFromCKAN } from "@/lib/ckan";
import {
	CACHE_KEYS,
	CACHE_TTL,
	getCachedData,
	setCachedData,
} from "@/lib/redis";
import type { CameraData, CKANCameraRecord } from "@/types";

interface LocalCameraRecord {
	id?: number;
	_id?: number;
	nome?: string;
	endereco?: string;
	latitude?: number | string;
	longitude?: number | string;
}

function mapCameraRecords(
	records: (CKANCameraRecord | LocalCameraRecord)[],
): CameraData[] {
	return records
		.map((record) => {
			const lat =
				typeof record.latitude === "number"
					? record.latitude
					: Number.parseFloat(String(record.latitude));
			const lng =
				typeof record.longitude === "number"
					? record.longitude
					: Number.parseFloat(String(record.longitude));

			const recordId =
				"_id" in record && record._id !== undefined
					? record._id
					: "id" in record && record.id !== undefined
						? record.id
						: 0;

			return {
				id: recordId,
				name: String(record.nome || ""),
				address: record.endereco || "",
				latitude: lat || 0,
				longitude: lng || 0,
			};
		})
		.filter(
			(camera) =>
				camera.latitude !== 0 &&
				camera.longitude !== 0 &&
				!Number.isNaN(camera.latitude) &&
				!Number.isNaN(camera.longitude),
		);
}

async function fetchCamerasFromAPI(): Promise<CameraData[]> {
	const records = await fetchFromCKAN<CKANCameraRecord>(
		"3d9a7f0d-cb38-48ee-9e10-d9b83284ae28",
	);
	return mapCameraRecords(records);
}

function getLocalCamerasFallback(): CameraData[] {
	try {
		const rawRecords =
			(localCamerasData as unknown as { records?: LocalCameraRecord[] })
				?.records ||
			(
				localCamerasData as unknown as {
					result?: { records?: LocalCameraRecord[] };
				}
			)?.result?.records;

		if (rawRecords && Array.isArray(rawRecords)) {
			return mapCameraRecords(rawRecords);
		}
		return [];
	} catch (e) {
		console.error("Erro ao carregar dados locais de câmeras:", e);
		return [];
	}
}

export async function getCameras(): Promise<CameraData[]> {
	try {
		const cachedCameras = await getCachedData<CameraData[]>(CACHE_KEYS.CAMERAS);

		if (cachedCameras && cachedCameras.length > 0) {
			return cachedCameras;
		}

		try {
			const cameras = await fetchCamerasFromAPI();
			if (cameras && cameras.length > 0) {
				await setCachedData(CACHE_KEYS.CAMERAS, cameras, CACHE_TTL);
				return cameras;
			}
		} catch (apiError) {
			console.warn(
				"API CKAN de câmeras falhou, usando fallback local:",
				(apiError as Error)?.message,
			);
		}

		return getLocalCamerasFallback();
	} catch (error) {
		console.error("Erro ao buscar dados de câmeras no service:", error);
		return getLocalCamerasFallback();
	}
}
