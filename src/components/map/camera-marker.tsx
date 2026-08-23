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
				className="!m-0"
			>
				<div className="w-[290px] sm:w-[310px] text-slate-800 font-sans overflow-hidden rounded-2xl">
					<div className="bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 min-w-0">
							<div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
								<PiSecurityCameraFill size={14} />
							</div>
							<span className="text-xs font-semibold tracking-wide truncate">
								Câmera CTTU
							</span>
						</div>
						<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
							#{camera.id}
						</span>
					</div>

					<div className="p-3.5 space-y-3 bg-white">
						<div className="pb-1 border-b border-slate-100">
							<span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 tracking-wider">
								Identificação
							</span>
							<h3 className="font-bold text-sm text-slate-900 leading-snug break-words">
								{camera.name}
							</h3>
						</div>

						<div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 flex items-start gap-2">
							<FiMapPin size={13} className="text-blue-600 mt-0.5 shrink-0" />
							<div className="min-w-0 flex-1">
								<span className="text-[10px] text-slate-500 font-medium block">
									Endereço / Ponto
								</span>
								<p className="text-xs font-bold text-slate-800 leading-snug break-words mt-0.5">
									{camera.address}
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 text-[11px]">
							<span className="text-slate-600 flex items-center gap-1 font-medium">
								<FiMapPin size={11} className="text-slate-400 shrink-0" />
								GPS:{" "}
								<strong className="text-slate-800 font-mono text-[10px]">
									{formattedCoords}
								</strong>
							</span>
							<button
								type="button"
								onClick={handleCopyCoords}
								className="text-blue-600 hover:text-blue-700 active:scale-95 font-semibold flex items-center gap-1 transition-all cursor-pointer"
								title="Copiar coordenadas"
							>
								{copied ? (
									<>
										<FiCheck size={12} className="text-emerald-600" />
										<span className="text-emerald-600 text-[10px]">
											Copiado!
										</span>
									</>
								) : (
									<>
										<FiCopy size={11} />
										<span className="text-[10px]">Copiar</span>
									</>
								)}
							</button>
						</div>

						<div className="grid grid-cols-2 gap-2 pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2 px-3 !bg-blue-600 hover:!bg-blue-700 active:scale-[0.98] !text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={12} className="!text-white shrink-0" />
								<span className="!text-white">Street View</span>
							</a>
							<a
								href={directionsUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2 px-3 !bg-slate-100 hover:!bg-slate-200 active:scale-[0.98] !text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-all cursor-pointer text-center"
							>
								<FiNavigation size={12} className="text-blue-600 shrink-0" />
								<span className="!text-slate-800">Como Chegar</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
