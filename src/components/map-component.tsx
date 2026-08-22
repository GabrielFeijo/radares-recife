"use client";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { FiCrosshair, FiFilter, FiMapPin, FiNavigation } from "react-icons/fi";
import { PiSecurityCameraFill, PiTrafficSignalFill } from "react-icons/pi";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { CameraData, RadarData } from "@/types";
import AddressSearch from "./address-search";
import { CameraMarker } from "./camera-marker";
import { MapControlButton } from "./map-control-button";
import { RadarMarker } from "./radar-marker";

interface MapProps {
	radars: RadarData[];
	cameras: CameraData[];
	center?: [number, number];
	zoom?: number;
}

interface SearchLocation {
	lat: number;
	lon: number;
	address: string;
}

interface UserLocation {
	lat: number;
	lon: number;
}

const defaults = {
	zoom: 13,
};

const defaultCenter = {
	lat: -8.0584,
	lng: -34.8848,
};

function MapController({
	center,
	zoom,
	trigger,
}: {
	center: [number, number];
	zoom: number;
	trigger: unknown;
}) {
	const map = useMap();

	useEffect(() => {
		map.zoomControl.setPosition("bottomright");
	}, [map]);

	useEffect(() => {
		if (trigger) {
			map.flyTo(center, zoom, {
				duration: 1.5,
			});
		}
	}, [trigger, center, zoom, map]);

	return null;
}

const searchIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
			<path fill="#ef4444" stroke="#991b1b" stroke-width="2" d="M20 1 C9 1 1 9 1 20 C1 31 20 49 20 49 S39 31 39 20 C39 9 31 1 20 1 Z"/>
			<circle cx="20" cy="20" r="8" fill="white"/>
		</svg>
	`),
	iconSize: [30, 40],
	iconAnchor: [15, 40],
	popupAnchor: [0, -40],
});

const userLocationIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
			<circle cx="18" cy="18" r="14" fill="#3b82f6" fill-opacity="0.3"/>
			<circle cx="18" cy="18" r="8" fill="#2563eb" stroke="white" stroke-width="2.5"/>
		</svg>
	`),
	iconSize: [36, 36],
	iconAnchor: [18, 18],
	popupAnchor: [0, -18],
});

const MapComponent: React.FC<MapProps> = ({
	radars,
	cameras,
	zoom = defaults.zoom,
}) => {
	const [activeMarker, setActiveMarker] = useState<number | string | null>(
		null,
	);
	const [showRadars, setShowRadars] = useState(true);
	const [showCameras, setShowCameras] = useState(true);
	const [selectedSpeed, setSelectedSpeed] = useState<string>("all");
	const [showSpeedFilter, setShowSpeedFilter] = useState(false);
	const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
		null,
	);
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
	const [isLocating, setIsLocating] = useState(false);
	const [mapCenter, setMapCenter] = useState<[number, number]>([
		defaultCenter.lat,
		defaultCenter.lng,
	]);
	const [mapZoom, setMapZoom] = useState(zoom);
	const [flyTrigger, setFlyTrigger] = useState<number>(0);

	const availableSpeeds = useMemo(() => {
		const speeds = new Set<string>();
		radars.forEach((r) => {
			if (r.monitoredSpeed) {
				speeds.add(r.monitoredSpeed.trim());
			}
		});
		return Array.from(speeds).sort();
	}, [radars]);

	const filteredRadars = useMemo(() => {
		if (selectedSpeed === "all") return radars;
		return radars.filter((r) => r.monitoredSpeed?.trim() === selectedSpeed);
	}, [radars, selectedSpeed]);

	const handleLocationSelect = (lat: number, lon: number, address: string) => {
		setSearchLocation({ lat, lon, address });
		setMapCenter([lat, lon]);
		setMapZoom(17);
		setFlyTrigger((prev) => prev + 1);
		setActiveMarker("search-location");
	};

	const handleLocateUser = () => {
		if (!navigator.geolocation) {
			alert("Geolocalização não é suportada pelo seu navegador.");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setUserLocation({ lat: latitude, lon: longitude });
				setMapCenter([latitude, longitude]);
				setMapZoom(16);
				setFlyTrigger((prev) => prev + 1);
				setActiveMarker("user-location");
				setIsLocating(false);
			},
			(error) => {
				console.warn("Erro ao obter geolocalização:", error.message);
				alert(
					"Não foi possível obter sua localização atual. Verifique as permissões do seu navegador.",
				);
				setIsLocating(false);
			},
			{ enableHighAccuracy: true, timeout: 8000 },
		);
	};

	return (
		<div className="relative w-full h-full overflow-hidden">
			{/* Barra de busca responsiva */}
			<div className="absolute top-3 left-3 right-3 sm:right-auto z-[999] sm:w-80 md:w-96">
				<AddressSearch onLocationSelect={handleLocationSelect} />
			</div>

			{/* Controles de camadas e ações */}
			<div className="absolute top-16 sm:top-3 right-3 z-[999] flex flex-wrap items-center gap-2">
				<MapControlButton
					onClick={() => setShowRadars(!showRadars)}
					isActive={showRadars}
					icon={
						<PiTrafficSignalFill
							size={20}
							className={showRadars ? "text-amber-600" : "text-gray-400"}
						/>
					}
					title={showRadars ? "Ocultar Radares" : "Exibir Radares"}
					ariaLabel="Alternar visibilidade de radares"
				/>

				<MapControlButton
					onClick={() => setShowCameras(!showCameras)}
					isActive={showCameras}
					icon={
						<PiSecurityCameraFill
							size={20}
							className={showCameras ? "text-blue-600" : "text-gray-400"}
						/>
					}
					title={showCameras ? "Ocultar Câmeras" : "Exibir Câmeras"}
					ariaLabel="Alternar visibilidade de câmeras"
				/>

				<MapControlButton
					onClick={() => setShowSpeedFilter(!showSpeedFilter)}
					isActive={showSpeedFilter || selectedSpeed !== "all"}
					icon={
						<FiFilter
							size={18}
							className={
								selectedSpeed !== "all" ? "text-emerald-600" : "text-gray-600"
							}
						/>
					}
					title="Filtrar por velocidade"
					ariaLabel="Filtrar por velocidade dos radares"
				/>

				<MapControlButton
					onClick={handleLocateUser}
					disabled={isLocating}
					icon={
						<FiCrosshair
							size={18}
							className={
								isLocating ? "animate-spin text-blue-600" : "text-gray-700"
							}
						/>
					}
					title="Minha Localização"
					ariaLabel="Centralizar mapa na minha localização atual"
				/>
			</div>

			{/* Menu dropdown de filtro de velocidades */}
			{showSpeedFilter && (
				<div className="absolute top-28 sm:top-16 right-3 z-[999] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200 flex flex-col gap-2 min-w-44 text-xs sm:text-sm">
					<p className="font-semibold text-gray-700 border-b pb-1">
						Velocidade Máxima:
					</p>
					<button
						type="button"
						onClick={() => setSelectedSpeed("all")}
						className={`text-left px-2 py-1 rounded transition-colors ${
							selectedSpeed === "all"
								? "bg-blue-600 text-white font-medium"
								: "text-gray-700 hover:bg-gray-100"
						}`}
					>
						Todas as velocidades ({radars.length})
					</button>
					{availableSpeeds.map((spd) => {
						const count = radars.filter(
							(r) => r.monitoredSpeed?.trim() === spd,
						).length;
						return (
							<button
								key={spd}
								type="button"
								onClick={() => setSelectedSpeed(spd)}
								className={`text-left px-2 py-1 rounded transition-colors ${
									selectedSpeed === spd
										? "bg-blue-600 text-white font-medium"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								{spd} ({count})
							</button>
						);
					})}
				</div>
			)}

			{/* Painel informativo inferior */}
			<div className="absolute bottom-4 left-3 z-[999] bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-lg shadow-lg border border-gray-200 text-xs sm:text-sm">
				<div className="flex items-center gap-2 font-medium text-gray-800">
					<span className="flex items-center gap-1">
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
						Radares: <strong>{showRadars ? filteredRadars.length : 0}</strong>
						{selectedSpeed !== "all" && (
							<span className="text-gray-500">({selectedSpeed})</span>
						)}
					</span>
					<span className="text-gray-300">|</span>
					<span className="flex items-center gap-1">
						<span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
						Câmeras: <strong>{showCameras ? cameras.length : 0}</strong>
					</span>
				</div>
				<p className="text-[11px] text-gray-500 mt-0.5">
					Dados CTTU / Prefeitura da Cidade do Recife
				</p>
			</div>

			<MapContainer
				center={mapCenter}
				zoom={mapZoom}
				style={{ height: "100vh", width: "100%" }}
				scrollWheelZoom={true}
				attributionControl={false}
			>
				<MapController center={mapCenter} zoom={mapZoom} trigger={flyTrigger} />
				<TileLayer url="https://www.google.cn/maps/vt?lyrs=m@221097413,traffic&x={x}&y={y}&z={z}" />

				{/* Marcador de Endereço Pesquisado */}
				{searchLocation && (
					<Marker
						position={[searchLocation.lat, searchLocation.lon]}
						icon={searchIcon}
						eventHandlers={{
							mousedown: () => setActiveMarker("search-location"),
						}}
					>
						{activeMarker === "search-location" && (
							<Popup autoClose={false} closeOnClick={false}>
								<section className="text-gray-900 max-w-xs space-y-2">
									<div className="flex items-start gap-2">
										<FiMapPin
											size={20}
											className="text-red-600 mt-0.5 shrink-0"
										/>
										<div>
											<h2 className="font-bold text-sm">
												Endereço Selecionado
											</h2>
											<p className="text-xs text-gray-700">
												{searchLocation.address}
											</p>
										</div>
									</div>
									<p className="text-xs text-gray-600 pt-1.5 border-t">
										<strong>Coordenadas:</strong>{" "}
										{searchLocation.lat.toFixed(5)},{" "}
										{searchLocation.lon.toFixed(5)}
									</p>
									<p className="text-xs">
										<a
											href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${searchLocation.lat},${searchLocation.lon}`}
											target="_blank"
											rel="noreferrer"
											className="text-blue-600 hover:text-blue-800 underline font-medium"
										>
											Abrir no Google Street View ↗
										</a>
									</p>
								</section>
							</Popup>
						)}
					</Marker>
				)}

				{/* Marcador de Localização do Usuário */}
				{userLocation && (
					<Marker
						position={[userLocation.lat, userLocation.lon]}
						icon={userLocationIcon}
						eventHandlers={{
							mousedown: () => setActiveMarker("user-location"),
						}}
					>
						{activeMarker === "user-location" && (
							<Popup autoClose={false} closeOnClick={false}>
								<section className="text-gray-900 space-y-1.5 p-1">
									<div className="flex items-center gap-1.5 font-bold text-blue-600 text-sm">
										<FiNavigation size={16} />
										<span>Sua Localização Atual</span>
									</div>
									<p className="text-xs text-gray-600">
										Coordenadas: {userLocation.lat.toFixed(5)},{" "}
										{userLocation.lon.toFixed(5)}
									</p>
								</section>
							</Popup>
						)}
					</Marker>
				)}

				{/* Marcadores de Radares */}
				{showRadars &&
					filteredRadars.map((radar) => (
						<RadarMarker
							key={`radar-${radar.id}`}
							radar={radar}
							isActive={activeMarker === `radar-${radar.id}`}
							onClick={() => setActiveMarker(`radar-${radar.id}`)}
						/>
					))}

				{/* Marcadores de Câmeras */}
				{showCameras &&
					cameras.map((camera) => (
						<CameraMarker
							key={`camera-${camera.id}`}
							camera={camera}
							isActive={activeMarker === `camera-${camera.id}`}
							onClick={() => setActiveMarker(`camera-${camera.id}`)}
						/>
					))}
			</MapContainer>
		</div>
	);
};

export default MapComponent;
