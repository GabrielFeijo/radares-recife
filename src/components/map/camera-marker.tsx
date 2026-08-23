"use client";

import type React from "react";
import { PiMapPinLineBold, PiSecurityCameraFill } from "react-icons/pi";
import { Marker, Popup } from "react-leaflet";
import type { CameraData } from "@/types";
import { cameraIcon } from "./map-icons";
import { PopupActions } from "./popup-actions";
import { PopupGpsRow } from "./popup-gps-row";
import { PopupHeader } from "./popup-header";

interface CameraMarkerProps {
	camera: CameraData;
}

export const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
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
				<div className="w-[300px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category="Câmera de Monitoramento"
						variant="camera"
						icon={<PiSecurityCameraFill size={13} className="text-sky-600" />}
						badge={
							<span className="font-mono text-slate-500">#{camera.id}</span>
						}
					/>

					<div className="p-3.5 space-y-3">
						<div>
							<span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-0.5">
								Ponto de Monitoramento
							</span>
							<h3 className="font-bold text-[13px] text-slate-900 leading-snug break-words">
								{camera.name}
							</h3>
						</div>

						<div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
							<PiMapPinLineBold
								size={14}
								className="text-slate-400 shrink-0 mt-0.5"
							/>
							<div className="min-w-0 flex-1">
								<span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
									Logradouro / Cruzamento
								</span>
								<p className="text-xs font-semibold text-slate-800 leading-snug break-words mt-0.5">
									{camera.address}
								</p>
							</div>
						</div>

						<PopupGpsRow
							latitude={camera.latitude}
							longitude={camera.longitude}
						/>

						<PopupActions
							latitude={camera.latitude}
							longitude={camera.longitude}
						/>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
