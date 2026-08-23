"use client";

import type React from "react";
import { FiExternalLink, FiMapPin, FiNavigation } from "react-icons/fi";
import { PiSecurityCameraFill } from "react-icons/pi";
import { Marker, Popup } from "react-leaflet";
import type { CameraData } from "@/types";
import {
	formatCoordinates,
	getDirectionsUrl,
	getStreetViewUrl,
} from "@/utils/maps";
import { cameraIcon } from "./map-icons";

interface CameraMarkerProps {
	camera: CameraData;
}

export const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
	const streetViewUrl = getStreetViewUrl(camera.latitude, camera.longitude);
	const directionsUrl = getDirectionsUrl(camera.latitude, camera.longitude);
	const formattedCoords = formatCoordinates(camera.latitude, camera.longitude);

	return (
		<Marker
			position={[camera.latitude, camera.longitude]}
			title={camera.address}
			icon={cameraIcon}
		>
			<Popup closeButton={false} autoClose>
				<div className="text-slate-800 font-sans space-y-2">
					<div className="flex items-center justify-between gap-2">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
							<PiSecurityCameraFill size={13} />
							Câmera de Monitoramento CTTU
						</span>
					</div>

					<h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug border-b border-slate-100 pb-3">
						{camera.name}
					</h3>

					<div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
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

					<div className="flex items-center justify-between bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 text-[11px]">
						<span className="text-slate-500 flex items-center gap-1.5">
							<FiMapPin size={13} className="text-slate-400 shrink-0" />
							GPS:{" "}
							<strong className="text-slate-700 font-mono">
								{formattedCoords}
							</strong>
						</span>
					</div>

					<div className="grid grid-cols-2 gap-2.5 pt-1">
						<a
							href={streetViewUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-blue-600 hover:!bg-blue-700 !text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-center"
						>
							<FiExternalLink size={13} className="!text-white shrink-0" />
							<span className="!text-white">Street View</span>
						</a>
						<a
							href={directionsUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-slate-100 hover:!bg-slate-200 !text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-center"
						>
							<FiNavigation size={13} className="text-blue-600 shrink-0" />
							<span className="!text-slate-800">Como Chegar</span>
						</a>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
