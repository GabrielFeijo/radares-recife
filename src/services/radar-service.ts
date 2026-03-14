import type { RadarData, CKANRadarRecord } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { fetchFromCKAN } from '@/lib/ckan';

async function fetchRadarsFromAPI(): Promise<RadarData[]> {
    const records = await fetchFromCKAN<CKANRadarRecord>('36c2b47b-f439-4895-8b65-3f3dda36a4a7');

    return records.map((record) => {
        const lat = typeof record.latitude === 'number' ? record.latitude : parseFloat(String(record.latitude));
        const lng = typeof record.longitude === 'number' ? record.longitude : parseFloat(String(record.longitude));
        const lanes = typeof record.faixas_fiscalizadas === 'number' ? record.faixas_fiscalizadas : parseInt(String(record.faixas_fiscalizadas), 10);
        const volume = typeof record.vmd === 'number' ? record.vmd : parseInt(String(record.vmd), 10);
        
        return {
            id: record._id,
            equipmentType: record.tipo_equipamento || '',
            inmetroRegistration: record.registro_inmetro || '',
            manufacturerSerialNumber: record.numero_serie_fabricante || '',
            equipmentIdentification: String(record.identificacao_equipamento || ''),
            installationLocation: record.local_instalacao || '',
            monitoringDirection: record.sentido_fiscalizacao || '',
            latitude: lat || 0,
            longitude: lng || 0,
            monitoredLanes: isNaN(lanes) ? 0 : lanes,
            monitoredSpeed: record.velocidade_fiscalizada || '',
            vmd: isNaN(volume) ? 0 : volume,
            vmdPeriod: record.periodo_vmd || ''
        };
    }).filter(radar => radar.latitude !== 0 && radar.longitude !== 0 && !isNaN(radar.latitude) && !isNaN(radar.longitude));
}

export async function getRadars(): Promise<RadarData[]> {
    try {
        const cachedRadars = await getCachedData<RadarData[]>(CACHE_KEYS.RADARS);

        if (cachedRadars) {
            return cachedRadars;
        }

        const radars = await fetchRadarsFromAPI();

        await setCachedData(CACHE_KEYS.RADARS, radars, CACHE_TTL);

        return radars;
    } catch (error) {
        console.error('Erro ao buscar dados de radares no service:', error);
        return [];
    }
}
