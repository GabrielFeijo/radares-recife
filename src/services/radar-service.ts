import localRadarsData from "@/data/radars.json";
import { fetchFromCKAN } from "@/lib/ckan";
import {
	CACHE_KEYS,
	CACHE_TTL,
	getCachedData,
	setCachedData,
} from "@/lib/redis";
import type { CKANRadarRecord, RadarData } from "@/types";

function mapRadarRecords(records: CKANRadarRecord[]): RadarData[] {
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
			const lanes =
				typeof record.faixas_fiscalizadas === "number"
					? record.faixas_fiscalizadas
					: Number.parseInt(String(record.faixas_fiscalizadas), 10);
			const volume =
				typeof record.vmd === "number"
					? record.vmd
					: Number.parseInt(String(record.vmd), 10);

			return {
				id: record._id,
				equipmentType: record.tipo_equipamento || "",
				inmetroRegistration: record.registro_inmetro || "",
				manufacturerSerialNumber: record.numero_serie_fabricante || "",
				equipmentIdentification: String(record.identificacao_equipamento || ""),
				installationLocation: record.local_instalacao || "",
				monitoringDirection: record.sentido_fiscalizacao || "",
				latitude: lat || 0,
				longitude: lng || 0,
				monitoredLanes: Number.isNaN(lanes) ? 0 : lanes,
				monitoredSpeed: record.velocidade_fiscalizada || "",
				vmd: Number.isNaN(volume) ? 0 : volume,
				vmdPeriod: record.periodo_vmd || "",
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
		"36c2b47b-f439-4895-8b65-3f3dda36a4a7",
	);
	return mapRadarRecords(records);
}

function getLocalRadarsFallback(): RadarData[] {
	try {
		const rawRecords = (
			localRadarsData as unknown as { result?: { records?: CKANRadarRecord[] } }
		)?.result?.records;
		if (rawRecords && Array.isArray(rawRecords)) {
			return mapRadarRecords(rawRecords);
		}
		return [];
	} catch (e) {
		console.error("Erro ao carregar dados locais de radares:", e);
		return [];
	}
}

export async function getRadars(): Promise<RadarData[]> {
	try {
		const cachedRadars = await getCachedData<RadarData[]>(CACHE_KEYS.RADARS);

		if (cachedRadars && cachedRadars.length > 0) {
			return cachedRadars;
		}

		try {
			const radars = await fetchRadarsFromAPI();
			if (radars && radars.length > 0) {
				await setCachedData(CACHE_KEYS.RADARS, radars, CACHE_TTL);
				return radars;
			}
		} catch (apiError) {
			console.warn(
				"API CKAN de radares falhou, usando fallback local:",
				(apiError as Error)?.message,
			);
		}

		return getLocalRadarsFallback();
	} catch (error) {
		console.error("Erro ao buscar dados de radares no service:", error);
		return getLocalRadarsFallback();
	}
}
