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
			<Popup
				closeButton={false}
				autoClose
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
			>
				<div className="text-slate-800 font-sans min-w-[290px] max-w-[340px] overflow-hidden">
					<div className="bg-gradient-to-r from-slate-900 via-slate-850 to-sky-950 text-white px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800">
						<div className="flex items-center gap-1.5 min-w-0">
							<span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
							<span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 truncate">
								Câmera de Monitoramento
							</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9.5px] font-bold shrink-0 font-mono">
							#{camera.id}
						</div>
					</div>

					<div className="p-3.5 space-y-2.5 bg-white">
						<div className="pb-2.5 border-b border-slate-100">
							<span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-0.5">
								<FiMapPin size={10} className="text-sky-600" />
								Ponto de Monitoramento
							</span>
							<h3 className="font-extrabold text-[13.5px] text-slate-900 leading-snug break-words">
								{camera.name}
							</h3>
						</div>

						<div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100/90 flex items-start gap-2.5">
							<div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
								<PiSecurityCameraFill size={13} />
							</div>
							<div className="min-w-0 flex-1">
								<span className="text-[10px] text-sky-800 font-bold uppercase tracking-wider block">
									Logradouro / Cruzamento
								</span>
								<p className="text-xs font-bold text-slate-900 leading-snug break-words mt-0.5">
									{camera.address}
								</p>
							</div>
						</div>

						<div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
							<div className="flex items-center justify-between text-[10.5px]">
								<div className="flex items-center gap-1.5 text-slate-600 font-medium min-w-0">
									<FiMapPin size={11} className="text-sky-600 shrink-0" />
									<span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
										GPS
									</span>
									<span className="text-slate-800 font-mono text-[10px] truncate">
										{formattedCoords}
									</span>
								</div>
								<button
									type="button"
									onClick={handleCopyCoords}
									className="text-sky-600 hover:text-sky-700 active:scale-95 font-bold flex items-center gap-1 transition-all cursor-pointer hover:bg-sky-50 px-2 py-0.5 rounded-md shrink-0 ml-2"
									title="Copiar coordenadas"
								>
									{copied ? (
										<>
											<FiCheck size={11} className="text-emerald-600" />
											<span className="text-emerald-600 text-[10px]">
												Copiado!
											</span>
										</>
									) : (
										<>
											<FiCopy size={10} />
											<span className="text-[10px]">Copiar</span>
										</>
									)}
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-gradient-to-r !from-sky-600 !to-blue-600 hover:!from-sky-700 hover:!to-blue-700 active:scale-[0.98] !text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-500/25 transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={13} className="!text-white shrink-0" />
								<span className="!text-white">Street View</span>
							</a>
							<a
								href={directionsUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-slate-100 hover:!bg-slate-200 active:scale-[0.98] !text-slate-800 rounded-xl text-xs font-bold border border-slate-200/90 shadow-xs transition-all cursor-pointer text-center"
							>
								<FiNavigation size={13} className="text-sky-600 shrink-0" />
								<span className="!text-slate-800">Como Chegar</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
