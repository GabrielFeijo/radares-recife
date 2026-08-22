import { NextResponse } from "next/server";
import { CACHE_KEYS, getRedisClient } from "@/lib/redis";

export async function GET() {
	try {
		const client = await getRedisClient();

		if (!client?.isOpen) {
			return NextResponse.json({
				success: true,
				cache_status: {
					available: false,
					message:
						"Redis offline ou não configurado. Aplicação operando em modo fallback/direto.",
					radars: { cached: false, ttl_seconds: -1, ttl_hours: 0 },
					cameras: { cached: false, ttl_seconds: -1, ttl_hours: 0 },
				},
			});
		}

		const radarsExists = await client.exists(CACHE_KEYS.RADARS);
		const camerasExists = await client.exists(CACHE_KEYS.CAMERAS);

		let radarsTTL = -1;
		let camerasTTL = -1;

		if (radarsExists) {
			radarsTTL = await client.ttl(CACHE_KEYS.RADARS);
		}

		if (camerasExists) {
			camerasTTL = await client.ttl(CACHE_KEYS.CAMERAS);
		}

		return NextResponse.json({
			success: true,
			cache_status: {
				radars: {
					cached: radarsExists > 0,
					ttl_seconds: radarsTTL,
					ttl_hours:
						radarsTTL > 0 ? Math.round((radarsTTL / 3600) * 10) / 10 : 0,
				},
				cameras: {
					cached: camerasExists > 0,
					ttl_seconds: camerasTTL,
					ttl_hours:
						camerasTTL > 0 ? Math.round((camerasTTL / 3600) * 10) / 10 : 0,
				},
			},
		});
	} catch (error) {
		console.error("Erro ao verificar status do cache:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Erro ao verificar status do cache",
			},
			{ status: 500 },
		);
	}
}
