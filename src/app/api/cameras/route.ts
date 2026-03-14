import { NextRequest, NextResponse } from 'next/server';
import type { CameraData, ApiResponse } from '@/types';
import { getCameras } from '@/services/camera-service';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<CameraData>>> {
    try {
        const cameras = await getCameras();

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