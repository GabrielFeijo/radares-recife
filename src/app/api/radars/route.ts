import { NextRequest, NextResponse } from 'next/server';
import type { RadarData, ApiResponse } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

const RADARS_CSV_URL = 'http://dados.recife.pe.gov.br/dataset/a511fbb8-c339-4618-be9e-8aa1fe880f5b/resource/e4c5acc3-c0b9-4127-ad08-472c5b9b003f/download/equipamentosfiscalizacao.csv';

function parseCSVToRadars(csvText: string): RadarData[] {
    const lines = csvText.trim().split('\n');

    return lines.slice(1).map(line => {
        const values = line.split(';');
        return {
            equipment_type: values[0] || '',
            inmetro_registration: values[1] || '',
            manufacturer_serial_number: values[2] || '',
            equipment_identification: values[3] || '',
            installation_location: values[4] || '',
            monitoring_direction: values[5] || '',
            latitude: parseFloat(values[6]) || 0,
            longitude: parseFloat(values[7]) || 0,
            monitored_lanes: parseInt(values[8]) || 0,
            monitored_speed: values[9] || '',
            vmd: parseInt(values[10]) || 0,
            vmd_period: values[11] || ''
        };
    }).filter(radar => radar.latitude !== 0 && radar.longitude !== 0);
}

async function fetchRadarsFromAPI(): Promise<RadarData[]> {
    const response = await fetch(RADARS_CSV_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)',
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Failed to fetch radars data:', response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Fetched radars data from API');

    const csvText = await response.text();
    return parseCSVToRadars(csvText);
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<RadarData>>> {
    try {
        const cachedRadars = await getCachedData<RadarData[]>(CACHE_KEYS.RADARS);

        if (cachedRadars) {
            console.log('Returning cached radars data');
            return NextResponse.json({
                success: true,
                data: cachedRadars
            });
        }

        const radars = await fetchRadarsFromAPI();

        await setCachedData(CACHE_KEYS.RADARS, radars, CACHE_TTL);

        return NextResponse.json({
            success: true,
            data: radars
        });

    } catch (error) {
        console.error('Erro ao buscar dados de radares:', error);

        return NextResponse.json({
            success: false,
            data: [],
            error: 'Erro ao buscar dados de radares'
        }, { status: 500 });
    }
}