"use client";

import { useCallback, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import AddressSearch from "@/components/search/address-search";
import { ToastProvider } from "@/components/ui/toast";
import { MAP_DEFAULTS, MAP_TILES } from "@/constants/map";
import { useCameras } from "@/hooks/use-cameras";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useMapControls } from "@/hooks/use-map-controls";
import { useRadars } from "@/hooks/use-radars";
import type { SearchLocation } from "@/types";
import { CameraMarker } from "./camera-marker";
import { MapController, type MapControllerHandle } from "./map-controller";
import { MapControls } from "./map-controls";
import { createCameraClusterIcon, createRadarClusterIcon } from "./map-icons";
import { MapLegend } from "./map-legend";
import { MapSkeleton } from "./map-skeleton";
import { MarkerClusterGroup } from "./marker-cluster-group";
import { RadarMarker } from "./radar-marker";
import { SearchMarker } from "./search-marker";
import { SpeedFilterPanel } from "./speed-filter-panel";
import { UserLocationMarker } from "./user-location-marker";

function MapContent() {
	const { data: radars = [], isLoading: radarsLoading } = useRadars();
	const { data: cameras = [], isLoading: camerasLoading } = useCameras();
	const controls = useMapControls(radars);
	const { userLocation, isLocating, locate } = useGeolocation();

	const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
		null,
	);

	const mapControllerRef = useRef<MapControllerHandle>(null);

	const flyTo = useCallback((lat: number, lon: number, zoom: number) => {
		mapControllerRef.current?.flyTo(lat, lon, zoom);
	}, []);

	const handleLocationSelect = useCallback(
		(lat: number, lon: number, address: string) => {
			setSearchLocation({ lat, lon, address });
			flyTo(lat, lon, MAP_DEFAULTS.searchZoom);
		},
		[flyTo],
	);

	const handleLocateUser = useCallback(() => {
		locate((lat, lon) => flyTo(lat, lon, MAP_DEFAULTS.locationZoom));
	}, [locate, flyTo]);

	if (radarsLoading || camerasLoading) {
		return <MapSkeleton />;
	}

	return (
		<div className="relative w-full h-[100dvh] overflow-hidden bg-slate-100">
			<div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 right-3 sm:right-auto z-map-search sm:w-80 md:w-96">
				<AddressSearch onLocationSelect={handleLocationSelect} />
			</div>

			<MapControls
				controls={controls}
				isLocating={isLocating}
				onLocate={handleLocateUser}
			/>

			{controls.showSpeedFilter && (
				<SpeedFilterPanel
					radars={radars}
					availableSpeeds={controls.availableSpeeds}
					selectedSpeed={controls.selectedSpeed}
					onSelectSpeed={controls.selectSpeed}
				/>
			)}

			<MapLegend
				radarCount={controls.showRadars ? controls.filteredRadars.length : 0}
				cameraCount={controls.showCameras ? cameras.length : 0}
				selectedSpeed={controls.selectedSpeed}
			/>

			<MapContainer
				center={MAP_DEFAULTS.center}
				zoom={MAP_DEFAULTS.zoom}
				style={{ height: "100%", width: "100%", backgroundColor: "#f8fafc" }}
				scrollWheelZoom={true}
				attributionControl={false}
			>
				<MapController controllerRef={mapControllerRef} />

				<TileLayer url={MAP_TILES.GOOGLE_MAPS.url} />

				{searchLocation && <SearchMarker location={searchLocation} />}
				{userLocation && <UserLocationMarker location={userLocation} />}

				{controls.showRadars && (
					<MarkerClusterGroup
						chunkedLoading
						maxClusterRadius={45}
						spiderfyOnMaxZoom={true}
						showCoverageOnHover={false}
						zoomToBoundsOnClick={true}
						disableClusteringAtZoom={17}
						iconCreateFunction={createRadarClusterIcon}
					>
						{controls.filteredRadars.map((radar) => (
							<RadarMarker
								key={`radar-${radar.id}`}
								radar={radar}
								showLabel={controls.showSpeedLabels}
							/>
						))}
					</MarkerClusterGroup>
				)}

				{controls.showCameras && (
					<MarkerClusterGroup
						chunkedLoading
						maxClusterRadius={45}
						spiderfyOnMaxZoom={true}
						showCoverageOnHover={false}
						zoomToBoundsOnClick={true}
						disableClusteringAtZoom={17}
						iconCreateFunction={createCameraClusterIcon}
					>
						{cameras.map((camera) => (
							<CameraMarker key={`camera-${camera.id}`} camera={camera} />
						))}
					</MarkerClusterGroup>
				)}
			</MapContainer>
		</div>
	);
}

export default function MapComponent() {
	return (
		<ToastProvider>
			<MapContent />
		</ToastProvider>
	);
}
