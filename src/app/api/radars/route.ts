import { NextRequest, NextResponse } from 'next/server';
import type { RadarData, ApiResponse } from '@/types';
import { getCachedData, setCachedData, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

const RADARS_API_URL = 'https://dados.recife.pe.gov.br/api/action/datastore_search';

interface CKANRadarRecord {
    _id: number;
    tipo_equipamento: string;
    registro_inmetro: string;
    numero_serie_fabricante: string;
    identificacao_equipamento: string | number;
    local_instalacao: string;
    sentido_fiscalizacao: string;
    latitude: number | string;
    longitude: number | string;
    faixas_fiscalizadas: number | string;
    velocidade_fiscalizada: string;
    vmd: number | string;
    periodo_vmd: string;
}

interface CKANRadarResponse {
    success: boolean;
    result: {
        records: CKANRadarRecord[];
    };
}

async function fetchRadarsFromAPI(): Promise<RadarData[]> {
    const response = await fetch(RADARS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)',
        },
        body: JSON.stringify({
            resource_id: '36c2b47b-f439-4895-8b65-3f3dda36a4a7',
        }),
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Failed to fetch radars data:', response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CKANRadarResponse = await response.json();

    if (!data.success || !data.result || !data.result.records) {
        throw new Error('Invalid data format from CKAN API for radars');
    }

    return data.result.records.map((record) => {
        const lat = typeof record.latitude === 'number' ? record.latitude : parseFloat(String(record.latitude));
        const lng = typeof record.longitude === 'number' ? record.longitude : parseFloat(String(record.longitude));
        const lanes = typeof record.faixas_fiscalizadas === 'number' ? record.faixas_fiscalizadas : parseInt(String(record.faixas_fiscalizadas), 10);
        const volume = typeof record.vmd === 'number' ? record.vmd : parseInt(String(record.vmd), 10);
        
        return {
            equipment_type: record.tipo_equipamento || '',
            inmetro_registration: record.registro_inmetro || '',
            manufacturer_serial_number: record.numero_serie_fabricante || '',
            equipment_identification: String(record.identificacao_equipamento || ''),
            installation_location: record.local_instalacao || '',
            monitoring_direction: record.sentido_fiscalizacao || '',
            latitude: lat || 0,
            longitude: lng || 0,
            monitored_lanes: isNaN(lanes) ? 0 : lanes,
            monitored_speed: record.velocidade_fiscalizada || '',
            vmd: isNaN(volume) ? 0 : volume,
            vmd_period: record.periodo_vmd || ''
        };
    }).filter(radar => radar.latitude !== 0 && radar.longitude !== 0 && !isNaN(radar.latitude) && !isNaN(radar.longitude));
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<RadarData>>> {
    try {
        const cachedRadars = await getCachedData<RadarData[]>(CACHE_KEYS.RADARS);

        if (cachedRadars) {
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