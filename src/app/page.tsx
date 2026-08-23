import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/map-skeleton";

const MapComponent = dynamic(() => import("@/components/map/map-component"), {
	loading: () => <MapSkeleton />,
	ssr: false,
});

export default function Home() {
	return (
		<main className="w-screen h-screen overflow-hidden">
			<MapComponent />
		</main>
	);
}
