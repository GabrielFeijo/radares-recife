"use client";

import type React from "react";
import {
	FiCheck,
	FiCopy,
	FiExternalLink,
	FiMapPin,
	FiNavigation,
} from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";
import { useClipboard } from "@/hooks/use-clipboard";
import type { UserLocation } from "@/hooks/use-geolocation";
import { formatCoordinates, getStreetViewUrl } from "@/utils/maps";
import { userLocationIcon } from "./map-icons";

interface UserLocationMarkerProps {
	location: UserLocation;
}

export function UserLocationMarker({ location }: UserLocationMarkerProps) {
	const { copied, copy } = useClipboard();
	const formattedCoords = formatCoordinates(location.lat, location.lon);
	const streetViewUrl = getStreetViewUrl(location.lat, location.lon);

	const handleCopyCoords = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${location.lat}, ${location.lon}`);
	};

	return (
		<Marker position={[location.lat, location.lon]} icon={userLocationIcon}>
			<Popup
				closeButton={false}
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
				className="!m-0"
			>
				<div className="w-[280px] sm:w-[300px] text-slate-800 font-sans overflow-hidden rounded-2xl">
					<div className="bg-slate-900 text-white px-3.5 py-3 flex items-center gap-1.5">
						<div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
							<FiNavigation size={13} />
						</div>
						<span className="text-xs font-semibold tracking-wide">
							Sua Localização
						</span>
					</div>

					<div className="p-3.5 space-y-3 bg-white">
						<div className="pb-1 border-b border-slate-100">
							<span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 tracking-wider">
								Status
							</span>
							<h3 className="font-bold text-sm text-slate-900 leading-snug">
								Posição GPS Atual
							</h3>
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

						<div className="pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="w-full flex items-center justify-center gap-1.5 py-2 px-3 !bg-blue-600 hover:!bg-blue-700 active:scale-[0.98] !text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={12} className="!text-white shrink-0" />
								<span className="!text-white">Ver no Street View</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
}
