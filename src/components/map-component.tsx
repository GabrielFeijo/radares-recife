'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { PiSecurityCameraFill, PiTrafficSignalFill } from 'react-icons/pi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { RadarData, CameraData } from '@/types';

interface MapProps {
	radars: RadarData[];
	cameras: CameraData[];
	center?: [number, number];
	zoom?: number;
}

const defaults = {
	zoom: 15,
};

const defaultCenter = {
	lat: -8.052643905437522,
	lng: -34.88519751855592,
};

const MapComponent: React.FC<MapProps> = ({
	radars,
	cameras,
	center = defaultCenter,
	zoom = defaults.zoom,
}) => {
	const [activeMarker, setActiveMarker] = useState<number | string | null>(null);
	const [showRadars, setShowRadars] = useState(true);
	const [showCameras, setShowCameras] = useState(false);

	const radarIcon = new L.Icon({
		iconUrl: '/icon.webp',
		iconSize: [30, 30],
	});

	const cameraIcon = new L.Icon({
		iconUrl: '/camera.png',
		iconSize: [30, 30],
	});

	return (
		<>
			<div className='absolute top-4 right-4 z-[999] space-x-2'>
				<button
					onClick={() => setShowRadars(!showRadars)}
					className={`bg-black text-white px-4 py-2 rounded border-2 border-white hover:bg-white hover:text-black hover:border-black transition-colors duration-300 ${!showRadars && 'bg-opacity-50'
						}`}
					title="Mostrar/Ocultar Radares"
				>
					<PiTrafficSignalFill size={24} />
				</button>
				<button
					onClick={() => setShowCameras(!showCameras)}
					className={`bg-black text-white px-4 py-2 rounded border-2 border-white hover:bg-white hover:text-black hover:border-black transition-colors duration-300 ${!showCameras && 'bg-opacity-50'
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
				center={center}
				zoom={zoom}
				style={{ height: '100vh', width: '100%' }}
				scrollWheelZoom={true}
				attributionControl={false}
			>
				<TileLayer url='https://www.google.cn/maps/vt?lyrs=m@221097413,traffic&x={x}&y={y}&z={z}' />

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
		</>
	);
};

export default MapComponent;
