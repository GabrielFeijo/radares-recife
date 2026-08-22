import L from "leaflet";
import type React from "react";
import { FiExternalLink, FiMapPin } from "react-icons/fi";
import { PiSecurityCameraFill } from "react-icons/pi";
import { Marker, Popup } from "react-leaflet";
import type { CameraData } from "@/types";

const cameraIcon = new L.Icon({
	iconUrl: "/camera.png",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16],
});

interface CameraMarkerProps {
	camera: CameraData;
	isActive: boolean;
	onClick: () => void;
}

export const CameraMarker: React.FC<CameraMarkerProps> = ({
	camera,
	isActive,
	onClick,
}) => {
	return (
		<Marker
			position={[camera.latitude, camera.longitude]}
			title={camera.address}
			icon={cameraIcon}
			eventHandlers={{
				mousedown: onClick,
			}}
		>
			{isActive && (
				<Popup autoClose>
					<div className="w-72 sm:w-80 text-slate-800 font-sans p-4 space-y-3">
						<div className="border-b border-slate-100 pb-2.5 space-y-1">
							<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
								<PiSecurityCameraFill size={13} />
								Câmera de Monitoramento CTTU
							</span>
							<h3 className="font-bold text-base text-slate-900 leading-snug">
								{camera.name}
							</h3>
						</div>

						<div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
							<FiMapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
							<div>
								<span className="text-[10px] text-slate-500 font-medium">
									Endereço / Ponto
								</span>
								<p className="text-xs font-semibold text-slate-800 leading-snug">
									{camera.address}
								</p>
							</div>
						</div>

						<p className="text-[11px] text-slate-500">
							Coordenadas:{" "}
							<strong className="text-slate-700">
								{camera.latitude.toFixed(5)}, {camera.longitude.toFixed(5)}
							</strong>
						</p>

						<a
							href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${camera.latitude},${camera.longitude}`}
							target="_blank"
							rel="noreferrer"
							className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
						>
							<span>Visualizar no Street View</span>
							<FiExternalLink size={13} />
						</a>
					</div>
				</Popup>
			)}
		</Marker>
	);
};
