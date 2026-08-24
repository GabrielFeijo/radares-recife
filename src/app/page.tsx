import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/map/map-skeleton";

const MapComponent = dynamic(() => import("@/components/map/map-component"), {
	loading: () => <MapSkeleton />,
	ssr: false,
});

export default function Home() {
	return (
		<main className="w-full h-full h-[100dvh] min-h-[100dvh] overflow-hidden">
			<MapComponent />
		</main>
	);
}
