'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import { PiSecurityCameraFill, PiTrafficSignalFill } from 'react-icons/pi';
import { FiMapPin } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { RadarData, CameraData } from '@/types';
import AddressSearch from './address-search';

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

const defaults = {
	zoom: 15,
};

const defaultCenter = {
	lat: -8.052643905437522,
	lng: -34.88519751855592,
};

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
	const map = useMap();

	useEffect(() => {
		map.zoomControl.setPosition('bottomright');
	}, [map]);

	const flyTo = () => {
		map.flyTo(center, zoom, {
			duration: 1.5,
		});
	};

	flyTo();

	return null;
}

const MapComponent: React.FC<MapProps> = ({
	radars,
	cameras,
	zoom = defaults.zoom,
}) => {
	const [activeMarker, setActiveMarker] = useState<number | string | null>(null);
	const [showRadars, setShowRadars] = useState(true);
	const [showCameras, setShowCameras] = useState(false);
	const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(null);
	const [mapCenter, setMapCenter] = useState<[number, number]>([defaultCenter.lat, defaultCenter.lng]);
	const [mapZoom, setMapZoom] = useState(zoom);

	const radarIcon = new L.Icon({
		iconUrl: '/icon.webp',
		iconSize: [30, 30],
	});

	const cameraIcon = new L.Icon({
		iconUrl: '/camera.png',
		iconSize: [30, 30],
	});

	const searchIcon = new L.Icon({
		iconUrl: 'data:image/svg+xml;base64,' + btoa(`
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
				<path fill="#ef4444" stroke="#991b1b" stroke-width="2" d="M20 1 C9 1 1 9 1 20 C1 31 20 49 20 49 S39 31 39 20 C39 9 31 1 20 1 Z"/>
				<circle cx="20" cy="20" r="8" fill="white"/>
			</svg>
		`),
		iconSize: [30, 40],
		iconAnchor: [20, 50],
		popupAnchor: [0, -50],
	});

	const handleLocationSelect = (lat: number, lon: number, address: string) => {
		setSearchLocation({ lat, lon, address });
		setMapCenter([lat, lon]);
		setMapZoom(17);
		setActiveMarker('search-location');
	};

	return (
		<div className='overflow-hidden'>
			<div className='absolute top-4 left-4 z-[999] w-[90%] md:w-auto md:block hidden'>
				<AddressSearch onLocationSelect={handleLocationSelect} />
			</div>

			<div className='absolute top-4 right-4 z-[999] space-x-2'>
				<button
					onClick={() => setShowRadars(!showRadars)}
					className={`px-4 py-2 border border-gray-300 bg-white bg-opacity-90 text-gray-800 rounded shadow-lg hover:bg-gray-50 transition-colors duration-300 ${!showRadars && 'bg-opacity-50 text-gray-500'
						}`}
					title="Mostrar/Ocultar Radares"
				>
					<PiTrafficSignalFill size={24} />
				</button>
				<button
					onClick={() => setShowCameras(!showCameras)}
					className={`px-4 py-2 border border-gray-300 bg-white bg-opacity-90 text-gray-800 rounded shadow-lg hover:bg-gray-50 transition-colors duration-300 ${!showCameras && 'bg-opacity-50 text-gray-500'
						}`}
					title="Mostrar/Ocultar Câmeras"
				>
					<PiSecurityCameraFill size={24} />
				</button>
			</div>

			<div className='absolute bottom-4 left-4 z-[999] bg-white bg-opacity-90 p-3 rounded shadow-lg'>
				<p className="text-sm font-semibold text-gray-600">
					Radares: {radars.length} | Câmeras: {cameras.length}
				</p>
				<p className="text-xs text-gray-600">
					Dados atualizados da Prefeitura do Recife
				</p>
			</div>

			<MapContainer
				center={mapCenter}
				zoom={mapZoom}
				style={{ height: '100vh', width: '100%' }}
				scrollWheelZoom={true}
				attributionControl={false}
			>
				<MapController center={mapCenter} zoom={mapZoom} />
				<TileLayer url='https://www.google.cn/maps/vt?lyrs=m@221097413,traffic&x={x}&y={y}&z={z}' />

				{searchLocation && (
					<Marker
						position={[searchLocation.lat, searchLocation.lon]}
						icon={searchIcon}
						eventHandlers={{
							mousedown: () => {
								setActiveMarker('search-location');
							},
						}}
					>
						{activeMarker === 'search-location' && (
							<Popup autoClose={false} closeOnClick={false}>
								<section className='text-black max-w-xs space-y-2 font-poppins'>
									<div className="flex items-start gap-2">
										<FiMapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
										<div>
											<h2 className="font-bold text-base mb-2">Local Pesquisado</h2>
											<p className="text-sm">{searchLocation.address}</p>
										</div>
									</div>
									<p className="text-xs text-gray-600 pt-2 border-t">
										<strong>Coordenadas:</strong> {searchLocation.lat.toFixed(6)}, {searchLocation.lon.toFixed(6)}
									</p>
									<p>
										<strong>Ver no Maps:</strong>{' '}
										<a
											href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${searchLocation.lat},${searchLocation.lon}`}
											target='_blank'
											rel='noreferrer'
											className="text-blue-600 hover:text-blue-800 underline"
										>
											Clique Aqui
										</a>
									</p>
								</section>
							</Popup>
						)}
					</Marker>
				)}

				{showRadars &&
					radars.map((radar, index) => (
						<Marker
							key={`radar-${index}`}
							position={[radar.latitude, radar.longitude]}
							title={radar.installation_location}
							icon={radarIcon}
							eventHandlers={{
								mousedown: () => {
									setActiveMarker(`radar-${index}`);
								},
							}}
						>
							<Tooltip
								offset={[15, 0]}
								opacity={1}
								permanent
								className='font-bold'
							>
								{radar.monitored_speed}
							</Tooltip>
							{activeMarker === `radar-${index}` && (
								<Popup autoClose>
									<section className='text-black max-w-52 space-y-2 font-poppins'>
										<h2 className="font-bold">Local: {radar.installation_location}</h2>
										<p><strong>Faixas Fiscalizadas:</strong> {radar.monitored_lanes}</p>
										<p><strong>Sentido:</strong> {radar.monitoring_direction}</p>
										<p><strong>Identificação:</strong> {radar.equipment_identification}</p>
										<p><strong>Tipo:</strong> {radar.equipment_type}</p>
										<p><strong>Velocidade:</strong> {radar.monitored_speed}</p>
										<p><strong>VMD:</strong> {radar.vmd.toLocaleString()} veículos/dia</p>
										<p><strong>Período VMD:</strong> {radar.vmd_period}</p>
										<p>
											<strong>Ver no Maps:</strong>{' '}
											<a
												href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${radar.latitude},${radar.longitude}`}
												target='_blank'
												rel='noreferrer'
												className="text-blue-600 hover:text-blue-800 underline"
											>
												Clique Aqui
											</a>
										</p>
									</section>
								</Popup>
							)}
						</Marker>
					))}

				{showCameras &&
					cameras.map((camera, index) => (
						<Marker
							key={`camera-${index}`}
							position={[camera.latitude, camera.longitude]}
							title={camera.address}
							icon={cameraIcon}
							eventHandlers={{
								mousedown: () => {
									setActiveMarker(`camera-${index}`);
								},
							}}
						>
							{activeMarker === `camera-${index}` && (
								<Popup autoClose>
									<section className='text-black max-w-52 space-y-2 font-poppins'>
										<h2 className="font-bold">Câmera: {camera.name}</h2>
										<p><strong>Local:</strong> {camera.address}</p>
										<p>
											<strong>Ver no Maps:</strong>{' '}
											<a
												href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${camera.latitude},${camera.longitude}`}
												target='_blank'
												rel='noreferrer'
												className="text-blue-600 hover:text-blue-800 underline"
											>
												Clique Aqui
											</a>
										</p>
									</section>
								</Popup>
							)}
						</Marker>
					))}
			</MapContainer>
		</div>
	);
};

export default MapComponent;