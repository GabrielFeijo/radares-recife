"use client";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	FiCrosshair,
	FiExternalLink,
	FiFilter,
	FiMapPin,
	FiNavigation,
} from "react-icons/fi";
import {
	PiSecurityCameraFill,
	PiTagBold,
	PiTrafficSignalFill,
} from "react-icons/pi";
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
	const [showCameras, setShowCameras] = useState(false);
	const [showSpeedLabels, setShowSpeedLabels] = useState(false);
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
			<div className="absolute top-3 left-3 right-3 sm:right-auto z-[999] sm:w-80 md:w-96">
				<AddressSearch onLocationSelect={handleLocationSelect} />
			</div>

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
					onClick={() => setShowSpeedLabels(!showSpeedLabels)}
					isActive={showSpeedLabels}
					icon={
						<PiTagBold
							size={18}
							className={showSpeedLabels ? "text-purple-600" : "text-gray-400"}
						/>
					}
					title={
						showSpeedLabels
							? "Ocultar Etiquetas de Velocidade"
							: "Exibir Etiquetas de Velocidade"
					}
					ariaLabel="Alternar rótulos fixos de velocidade"
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

			{showSpeedFilter && (
				<div className="absolute top-28 sm:top-16 right-3 z-[999] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col gap-1.5 min-w-52 text-xs">
					<div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
						<span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
							<FiFilter size={13} className="text-emerald-600" />
							Filtrar por Velocidade
						</span>
						<span className="text-[10px] text-slate-400 font-medium">
							{filteredRadars.length} exibidos
						</span>
					</div>
					<button
						type="button"
						onClick={() => setSelectedSpeed("all")}
						className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
							selectedSpeed === "all"
								? "bg-blue-600 text-white font-semibold shadow-sm"
								: "text-slate-700 hover:bg-slate-100/80 font-medium"
						}`}
					>
						<span>Todas as velocidades</span>
						<span
							className={`text-[10px] px-1.5 py-0.5 rounded-md ${
								selectedSpeed === "all"
									? "bg-blue-700/80 text-white"
									: "bg-slate-100 text-slate-600"
							}`}
						>
							{radars.length}
						</span>
					</button>
					{availableSpeeds.map((spd) => {
						const count = radars.filter(
							(r) => r.monitoredSpeed?.trim() === spd,
						).length;
						const isSelected = selectedSpeed === spd;
						return (
							<button
								key={spd}
								type="button"
								onClick={() => setSelectedSpeed(spd)}
								className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
									isSelected
										? "bg-blue-600 text-white font-semibold shadow-sm"
										: "text-slate-700 hover:bg-slate-100/80 font-medium"
								}`}
							>
								<span>{spd}</span>
								<span
									className={`text-[10px] px-1.5 py-0.5 rounded-md ${
										isSelected
											? "bg-blue-700/80 text-white"
											: "bg-slate-100 text-slate-600"
									}`}
								>
									{count}
								</span>
							</button>
						);
					})}
				</div>
			)}

			<div className="absolute bottom-4 left-3 z-[999] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-200/80 text-xs">
				<div className="flex items-center gap-3 font-semibold text-slate-800">
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
						Radares:{" "}
						<strong className="text-slate-900">
							{showRadars ? filteredRadars.length : 0}
						</strong>
						{selectedSpeed !== "all" && (
							<span className="text-[11px] font-normal text-slate-500">
								({selectedSpeed})
							</span>
						)}
					</span>
					<span className="text-slate-200">|</span>
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
						Câmeras:{" "}
						<strong className="text-slate-900">
							{showCameras ? cameras.length : 0}
						</strong>
					</span>
				</div>
				<p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
					Dados oficiais CTTU / Prefeitura do Recife
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
								<div className="w-72 sm:w-80 text-slate-800 font-sans p-4 space-y-3">
									<div className="border-b border-slate-100 pb-2.5 flex items-start gap-2">
										<div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200/60">
											<FiMapPin size={16} />
										</div>
										<div>
											<span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
												Local Pesquisado
											</span>
											<h3 className="font-bold text-sm text-slate-900 leading-snug">
												{searchLocation.address}
											</h3>
										</div>
									</div>
									<div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-xs">
										<span className="text-[10px] text-slate-500 font-medium">
											Coordenadas GPS
										</span>
										<p className="font-semibold text-slate-800">
											{searchLocation.lat.toFixed(5)},{" "}
											{searchLocation.lon.toFixed(5)}
										</p>
									</div>
									<a
										href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${searchLocation.lat},${searchLocation.lon}`}
										target="_blank"
										rel="noreferrer"
										className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
									>
										<span>Abrir no Google Street View</span>
										<FiExternalLink size={13} />
									</a>
								</div>
							</Popup>
						)}
					</Marker>
				)}

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
								<div className="w-64 text-slate-800 font-sans p-4 space-y-2.5">
									<div className="flex items-center gap-2 border-b border-slate-100 pb-2">
										<div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
											<FiNavigation size={15} />
										</div>
										<div>
											<span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
												Sua Posição
											</span>
											<h3 className="font-bold text-sm text-slate-900">
												Localização Atual
											</h3>
										</div>
									</div>
									<p className="text-xs text-slate-600">
										Coordenadas:{" "}
										<strong>
											{userLocation.lat.toFixed(5)},{" "}
											{userLocation.lon.toFixed(5)}
										</strong>
									</p>
								</div>
							</Popup>
						)}
					</Marker>
				)}

				{showRadars &&
					filteredRadars.map((radar) => (
						<RadarMarker
							key={`radar-${radar.id}`}
							radar={radar}
							isActive={activeMarker === `radar-${radar.id}`}
							showLabel={showSpeedLabels}
							onClick={() => setActiveMarker(`radar-${radar.id}`)}
						/>
					))}

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
