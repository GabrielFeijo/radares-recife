import { CKAN_RESOURCE_IDS } from "@/constants/map";
import localRadarsData from "@/data/radars.json";
import { fetchFromCKAN } from "@/lib/ckan";
import {
	CACHE_KEYS,
	CACHE_TTL,
	getCachedData,
	setCachedData,
} from "@/lib/redis";
import type { CKANRadarRecord, RadarData } from "@/types";
import { sanitizeText } from "@/utils/text";

function toFloat(value: number | string): number {
	return typeof value === "number" ? value : Number.parseFloat(String(value));
}

function toInt(value: number | string): number {
	return typeof value === "number" ? value : Number.parseInt(String(value), 10);
}

function mapRadarRecords(records: CKANRadarRecord[]): RadarData[] {
	return records
		.map((record) => {
			const lat = toFloat(record.latitude);
			const lng = toFloat(record.longitude);
			const lanes = toInt(record.faixas_fiscalizadas);
			const volume = toInt(record.vmd);

			return {
				id: record._id,
				equipmentType: sanitizeText(record.tipo_equipamento || ""),
				inmetroRegistration: sanitizeText(record.registro_inmetro || ""),
				manufacturerSerialNumber: sanitizeText(
					record.numero_serie_fabricante || "",
				),
				equipmentIdentification: sanitizeText(
					String(record.identificacao_equipamento || ""),
				),
				installationLocation: sanitizeText(record.local_instalacao || ""),
				monitoringDirection: sanitizeText(record.sentido_fiscalizacao || ""),
				latitude: lat || 0,
				longitude: lng || 0,
				monitoredLanes: Number.isNaN(lanes) ? 0 : lanes,
				monitoredSpeed: sanitizeText(record.velocidade_fiscalizada || ""),
				vmd: Number.isNaN(volume) ? 0 : volume,
				vmdPeriod: sanitizeText(record.periodo_vmd || ""),
			};
		})
		.filter(
			(radar) =>
				radar.latitude !== 0 &&
				radar.longitude !== 0 &&
				!Number.isNaN(radar.latitude) &&
				!Number.isNaN(radar.longitude),
		);
}

async function fetchRadarsFromAPI(): Promise<RadarData[]> {
	const records = await fetchFromCKAN<CKANRadarRecord>(
		CKAN_RESOURCE_IDS.RADARS,
	);
	return mapRadarRecords(records);
}

function getLocalRadarsFallback(): RadarData[] {
	try {
		const rawRecords = (
			localRadarsData as unknown as { result?: { records?: CKANRadarRecord[] } }
		)?.result?.records;

		return rawRecords && Array.isArray(rawRecords)
			? mapRadarRecords(rawRecords)
			: [];
	} catch {
		return [];
	}
}

export async function getRadars(): Promise<RadarData[]> {
	try {
		const cached = await getCachedData<RadarData[]>(CACHE_KEYS.RADARS);
		if (cached && cached.length > 0) return cached;

		try {
			const radars = await fetchRadarsFromAPI();
			if (radars.length > 0) {
				await setCachedData(CACHE_KEYS.RADARS, radars, CACHE_TTL);
				return radars;
			}
		} catch {}

		return getLocalRadarsFallback();
	} catch {
		return getLocalRadarsFallback();
	}
}
