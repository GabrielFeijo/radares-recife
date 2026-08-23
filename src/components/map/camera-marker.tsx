"use client";

import type React from "react";
import {
	FiCheck,
	FiCopy,
	FiExternalLink,
	FiMapPin,
	FiNavigation,
} from "react-icons/fi";
import { PiSecurityCameraFill } from "react-icons/pi";
import { Marker, Popup } from "react-leaflet";
import { useClipboard } from "@/hooks/use-clipboard";
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
	const { copied, copy } = useClipboard();
	const streetViewUrl = getStreetViewUrl(camera.latitude, camera.longitude);
	const directionsUrl = getDirectionsUrl(camera.latitude, camera.longitude);
	const formattedCoords = formatCoordinates(camera.latitude, camera.longitude);

	const handleCopyCoords = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${camera.latitude}, ${camera.longitude}`);
	};

	return (
		<Marker
			position={[camera.latitude, camera.longitude]}
			title={camera.address}
			icon={cameraIcon}
		>
			<Popup closeButton={false} autoClose className="!m-0">
				<div className="w-[300px] sm:w-[330px] text-slate-800 font-sans p-4 space-y-3">
					<div className="flex items-center justify-between gap-2">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50/90 text-blue-700 border border-blue-200/70 shadow-xs">
							<PiSecurityCameraFill size={14} className="shrink-0" />
							Câmera CTTU
						</span>
						<span className="text-[10px] text-slate-400 font-medium">
							ID #{camera.id}
						</span>
					</div>

					<div className="pt-0.5 pb-2 border-b border-slate-100">
						<span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
							Identificação
						</span>
						<h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug break-words">
							{camera.name}
						</h3>
					</div>

					<div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5">
						<div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60">
							<FiMapPin size={13} />
						</div>
						<div className="min-w-0 flex-1">
							<span className="text-[10px] text-slate-500 font-medium block mb-0.5">
								Endereço / Ponto
							</span>
							<p className="text-xs font-semibold text-slate-800 leading-snug break-words">
								{camera.address}
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between bg-slate-50/90 px-3 py-2 rounded-xl border border-slate-100 text-[11px]">
						<span className="text-slate-500 flex items-center gap-1.5">
							<FiMapPin size={13} className="text-slate-400 shrink-0" />
							GPS:{" "}
							<strong className="text-slate-700 font-mono text-[11px]">
								{formattedCoords}
							</strong>
						</span>
						<button
							type="button"
							onClick={handleCopyCoords}
							className="text-blue-600 hover:text-blue-700 active:scale-95 font-medium flex items-center gap-1 transition-all cursor-pointer select-none"
							title="Copiar coordenadas"
						>
							{copied ? (
								<>
									<FiCheck size={13} className="text-emerald-600" />
									<span className="text-emerald-600 font-semibold text-[10px]">
										Copiado!
									</span>
								</>
							) : (
								<>
									<FiCopy size={13} />
									<span className="text-[10px]">Copiar</span>
								</>
							)}
						</button>
					</div>

					<div className="grid grid-cols-2 gap-2 pt-1">
						<a
							href={streetViewUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all duration-150 cursor-pointer text-center"
						>
							<FiExternalLink size={13} className="shrink-0" />
							<span>Street View</span>
						</a>
						<a
							href={directionsUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/90 active:scale-[0.98] text-slate-800 rounded-xl text-xs font-semibold border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer text-center"
						>
							<FiNavigation size={13} className="text-blue-600 shrink-0" />
							<span>Como Chegar</span>
						</a>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
