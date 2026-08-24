import { CKAN_RESOURCE_IDS } from "@/constants/map";
import localCamerasData from "@/data/cameras.json";
import { fetchFromCKAN } from "@/lib/ckan";
import {
	CACHE_KEYS,
	CACHE_TTL,
	getCachedData,
	setCachedData,
} from "@/lib/redis";
import type { CameraData, CKANCameraRecord } from "@/types";
import { sanitizeText } from "@/utils/text";

type RawCameraRecord = {
	_id?: number;
	id?: number;
	nome?: string | number;
	endereco?: string;
	latitude?: number | string;
	longitude?: number | string;
};

function parseCoord(value: number | string | undefined): number {
	if (value === undefined || value === null) return 0;
	return typeof value === "number" ? value : Number.parseFloat(String(value));
}

function mapCameraRecords(records: RawCameraRecord[]): CameraData[] {
	return records
		.map((record) => ({
			id: record._id ?? record.id ?? 0,
			name: sanitizeText(String(record.nome || "")),
			address: sanitizeText(record.endereco || ""),
			latitude: parseCoord(record.latitude),
			longitude: parseCoord(record.longitude),
		}))
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
		CKAN_RESOURCE_IDS.CAMERAS,
	);
	return mapCameraRecords(records);
}

function getLocalCamerasFallback(): CameraData[] {
	try {
		const local = localCamerasData as unknown as {
			records?: RawCameraRecord[];
			result?: { records?: RawCameraRecord[] };
		};

		const rawRecords = local.records ?? local.result?.records;
		return rawRecords && Array.isArray(rawRecords)
			? mapCameraRecords(rawRecords)
			: [];
	} catch {
		return [];
	}
}

export async function getCameras(): Promise<CameraData[]> {
	try {
		const cached = await getCachedData<CameraData[]>(CACHE_KEYS.CAMERAS);
		if (cached && cached.length > 0) return cached;

		try {
			const cameras = await fetchCamerasFromAPI();
			if (cameras.length > 0) {
				await setCachedData(CACHE_KEYS.CAMERAS, cameras, CACHE_TTL);
				return cameras;
			}
		} catch {}

		return getLocalCamerasFallback();
	} catch {
		return getLocalCamerasFallback();
	}
}
