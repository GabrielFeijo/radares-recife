import { NextResponse } from "next/server";
import { getCameras } from "@/services/camera-service";
import type { ApiResponse, CameraData } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<CameraData>>> {
	try {
		const cameras = await getCameras();

		return NextResponse.json({
			success: true,
			data: cameras,
		});
	} catch (error) {
		console.error("Erro ao buscar dados de câmeras:", error);

		return NextResponse.json(
			{
				success: false,
				data: [],
				error: "Erro ao buscar dados de câmeras",
			},
			{ status: 500 },
		);
	}
}
