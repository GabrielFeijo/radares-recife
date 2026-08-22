import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/map-skeleton";
import { getCameras } from "@/services/camera-service";
import { getRadars } from "@/services/radar-service";

const MapComponent = dynamic(() => import("@/components/map-component"), {
	loading: () => <MapSkeleton />,
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
