import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { RadarData, CameraData } from '@/types';

async function fetchRadarsData(): Promise<RadarData[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/radars`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Erro ao buscar radares');
		}

		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Erro ao buscar radares:', error);
		return [];
	}
}

async function fetchCamerasData(): Promise<CameraData[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cameras`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Erro ao buscar câmeras');
		}

		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Erro ao buscar câmeras:', error);
		return [];
	}
}

export default async function Home() {
	const MapComponent = useMemo(
		() =>
			dynamic(() => import('@/components/map-component'), {
				loading: () => (
					<div className='flex flex-col h-screen items-center justify-center gap-4'>
						<h1 className='text-2xl font-medium'>Carregando Mapa</h1>
						<div className='w-10 h-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
					</div>
				),
				ssr: false,
			}),
		[]
	);

	const [radarsData, camerasData] = await Promise.all([
		fetchRadarsData(),
		fetchCamerasData()
	]);

	return (
		<div className='w-screen h-screen'>
			<MapComponent radars={radarsData} cameras={camerasData} />
		</div>
	);
}
