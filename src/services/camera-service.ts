import type { CameraData, CKANCameraRecord } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { fetchFromCKAN } from '@/lib/ckan';

async function fetchCamerasFromAPI(): Promise<CameraData[]> {
    const records = await fetchFromCKAN<CKANCameraRecord>('3d9a7f0d-cb38-48ee-9e10-d9b83284ae28');

    return records.map(record => {
        const lat = typeof record.latitude === 'number' ? record.latitude : parseFloat(String(record.latitude));
        const lng = typeof record.longitude === 'number' ? record.longitude : parseFloat(String(record.longitude));
        
        return {
            id: record._id,
            name: String(record.nome || ''),
            address: record.endereco || '',
            latitude: lat || 0,
            longitude: lng || 0
        };
    }).filter(camera => camera.latitude !== 0 && camera.longitude !== 0 && !isNaN(camera.latitude) && !isNaN(camera.longitude));
}

export async function getCameras(): Promise<CameraData[]> {
    try {
        const cachedCameras = await getCachedData<CameraData[]>(CACHE_KEYS.CAMERAS);

        if (cachedCameras) {
            return cachedCameras;
        }

        const cameras = await fetchCamerasFromAPI();

        await setCachedData(CACHE_KEYS.CAMERAS, cameras, CACHE_TTL);

        return cameras;
    } catch (error) {
        console.error('Erro ao buscar dados de câmeras no service:', error);
        return [];
    }
}
