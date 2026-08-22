import dynamic from "next/dynamic";
import { getCameras } from "@/services/camera-service";
import { getRadars } from "@/services/radar-service";

const MapComponent = dynamic(() => import("@/components/map-component"), {
	loading: () => (
		<div className="flex flex-col h-screen items-center justify-center gap-4 bg-gray-50">
			<h1 className="text-2xl font-semibold text-gray-800">
				Carregando Mapa de Radares
			</h1>
			<div className="w-10 h-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
		</div>
	),
	ssr: false,
});

export default async function Home() {
	const [radarsData, camerasData] = await Promise.all([
		getRadars(),
		getCameras(),
	]);

	return (
		<main className="w-screen h-screen overflow-hidden">
			<MapComponent radars={radarsData} cameras={camerasData} />
		</main>
	);
}
