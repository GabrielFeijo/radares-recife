import { NextRequest, NextResponse } from 'next/server';
import type { CameraData, ApiResponse } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

const CAMERAS_CSV_URL = 'http://dados.recife.pe.gov.br/dataset/a511fbb8-c339-4618-be9e-8aa1fe880f5b/resource/5f31c2b8-b292-47ee-8443-647619dcbbcf/download/monitoramentocttu.csv';

function parseCSVToCameras(csvText: string): CameraData[] {
    const lines = csvText.trim().split('\n');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            name: values[0] || '',
            address: values[1] || '',
            latitude: parseFloat(values[2]) || 0,
            longitude: parseFloat(values[3]) || 0
        };
    }).filter(camera => camera.latitude !== 0 && camera.longitude !== 0);
}

async function fetchCamerasFromAPI(): Promise<CameraData[]> {
    const response = await fetch(CAMERAS_CSV_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)',
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    return parseCSVToCameras(csvText);
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<CameraData>>> {
    try {
        const cachedCameras = await getCachedData<CameraData[]>(CACHE_KEYS.CAMERAS);

        if (cachedCameras) {
            console.log('Returning cached cameras data');
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