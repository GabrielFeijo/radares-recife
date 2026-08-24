import { NextResponse } from "next/server";
import { getRadars } from "@/services/radar-service";
import type { ApiResponse, RadarData } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<RadarData>>> {
	try {
		const radars = await getRadars();

		return NextResponse.json({
			success: true,
			data: radars,
		});
	} catch {
		return NextResponse.json(
			{
				success: false,
				data: [],
				error: "Erro ao buscar dados de radares",
			},
			{ status: 500 },
		);
	}
}
