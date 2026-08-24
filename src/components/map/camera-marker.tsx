"use client";

import type React from "react";
import { PiMapPinLineBold } from "react-icons/pi";
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
						badge={camera.id ? `#${camera.id}` : undefined}
					/>

					<div className="p-3.5 space-y-3">
						<div>
							<h3 className="font-bold text-[13.5px] text-slate-900 leading-snug break-words">
								{camera.name}
							</h3>
							<div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium mt-1 leading-snug">
								<PiMapPinLineBold
									size={12}
									className="text-slate-400 shrink-0 mt-0.5"
								/>
								<span className="break-words">{camera.address}</span>
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
