import { NextRequest, NextResponse } from 'next/server';
import type { CameraData, ApiResponse } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

const CAMERAS_API_URL = 'https://dados.recife.pe.gov.br/api/action/datastore_search';

interface CKANCameraRecord {
    _id: number;
    nome: number | string;
    endereco: string;
    latitude: number | string;
    longitude: number | string;
}

interface CKANResponse {
    success: boolean;
    result: {
        records: CKANCameraRecord[];
    };
}

async function fetchCamerasFromAPI(): Promise<CameraData[]> {
    const response = await fetch(CAMERAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)',
        },
        body: JSON.stringify({
            resource_id: '3d9a7f0d-cb38-48ee-9e10-d9b83284ae28',
        }),
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CKANResponse = await response.json();

    if (!data.success || !data.result || !data.result.records) {
        throw new Error('Invalid data format from CKAN API');
    }

    return data.result.records.map(record => {
        const lat = typeof record.latitude === 'number' ? record.latitude : parseFloat(String(record.latitude));
        const lng = typeof record.longitude === 'number' ? record.longitude : parseFloat(String(record.longitude));
        
        return {
            name: String(record.nome || ''),
            address: record.endereco || '',
            latitude: lat || 0,
            longitude: lng || 0
        };
    }).filter(camera => camera.latitude !== 0 && camera.longitude !== 0 && !isNaN(camera.latitude) && !isNaN(camera.longitude));
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<CameraData>>> {
    try {
        const cachedCameras = await getCachedData<CameraData[]>(CACHE_KEYS.CAMERAS);

        if (cachedCameras) {
            return NextResponse.json({
                success: true,
                data: cachedCameras
            });
        }

        const cameras = await fetchCamerasFromAPI();

        await setCachedData(CACHE_KEYS.CAMERAS, cameras, CACHE_TTL);

        return NextResponse.json({
            success: true,
            data: cameras
        });

    } catch (error) {
        console.error('Erro ao buscar dados de câmeras:', error);

        return NextResponse.json({
            success: false,
            data: [],
            error: 'Erro ao buscar dados de câmeras'
        }, { status: 500 });
    }
}