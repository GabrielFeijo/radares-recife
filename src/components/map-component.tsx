'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { PiSecurityCameraFill, PiTrafficSignalFill } from 'react-icons/pi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import allRadars from '@/data/radars.json';
import allCameras from '@/data/cameras.json';

interface MapProps {
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
	center = defaultCenter,
	zoom = defaults.zoom,
}) => {
	const radars = allRadars.result.records;
	const cameras = allCameras.records;

	const [activeMarker, setActiveMarker] = useState<number | null>(null);
	const [showRadars, setShowRadars] = useState(true);
	const [showCameras, setShowCameras] = useState(false);

	const customIcon = new L.Icon({
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
				>
					<PiTrafficSignalFill size={24} />
				</button>
				<button
					onClick={() => setShowCameras(!showCameras)}
					className={`bg-black text-white px-4 py-2 rounded border-2 border-white hover:bg-white hover:text-black hover:border-black transition-colors duration-300 ${!showCameras && 'bg-opacity-50'
						}`}
				>
					<PiSecurityCameraFill size={24} />
				</button>
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
					radars.map((radar) => (
						<Marker
							key={radar._id}
							position={[radar.latitude, radar.longitude]}
							title={radar.local_instalacao}
							icon={customIcon}
							eventHandlers={{
								mousedown: () => {
									setActiveMarker(radar._id);
								},
							}}
						>
							<Tooltip
								offset={[15, 0]}
								opacity={1}
								permanent
								className='font-bold'
							>
								{radar.velocidade_fiscalizada}
							</Tooltip>
							{activeMarker === radar._id && (
								<Popup autoClose>
									<section className='text-black max-w-52 space-y-2 font-poppins'>
										<h2>Local: {radar.local_instalacao}</h2>
										<p>Faixas Fiscalizadas: {radar.faixas_fiscalizadas}</p>
										<p>Sentido: {radar.sentido_fiscalizacao}</p>
										<p>Radar: {radar.identificacao_equipamento}</p>
										<p>Tipo: {radar.tipo_equipamento}</p>
										<p>
											Velocidade Fiscalizada: {radar.velocidade_fiscalizada}{' '}
											Km/h
										</p>
										<p>
											Ver no Maps:{' '}
											<a
												href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${radar.latitude},${radar.longitude}`}
												target='_blank'
												rel='noreferrer'
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
					cameras.map((camera) => (
						<Marker
							key={camera.id}
							position={[camera.latitude, camera.longitude]}
							title={camera.endereco}
							icon={cameraIcon}
							eventHandlers={{
								mousedown: () => {
									setActiveMarker(camera.id);
								},
							}}
						>
							{activeMarker === camera.id && (
								<Popup autoClose>
									<section className='text-black max-w-52 space-y-2 font-poppins'>
										<h2>Local: {camera.endereco}</h2>
										<p>
											Ver no Maps:{' '}
											<a
												href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${camera.latitude},${camera.longitude}`}
												target='_blank'
												rel='noreferrer'
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
