import { NextRequest, NextResponse } from 'next/server';
import type { RadarData, ApiResponse } from '@/types';
import { getRadars } from '@/services/radar-service';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<RadarData>>> {
    try {
        const radars = await getRadars();

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