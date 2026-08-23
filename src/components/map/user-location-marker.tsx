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
			>
				<div className="text-slate-800 font-sans min-w-[290px] max-w-[340px] overflow-hidden">
					<div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800">
						<div className="flex items-center gap-1.5 min-w-0">
							<span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
							<span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 truncate">
								Sua Localização
							</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-bold shrink-0">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
							<span>AO VIVO</span>
						</div>
					</div>

					<div className="p-3.5 space-y-2.5 bg-white">
						<div className="pb-2.5 border-b border-slate-100">
							<span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-0.5">
								<FiNavigation size={10} className="text-emerald-600" />
								Telemetria GPS
							</span>
							<h3 className="font-extrabold text-[13.5px] text-slate-900 leading-snug">
								Posição Atual do Seu Dispositivo
							</h3>
						</div>

						<div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
							<div className="flex items-center justify-between text-[10.5px]">
								<div className="flex items-center gap-1.5 text-slate-600 font-medium min-w-0">
									<FiMapPin size={11} className="text-emerald-600 shrink-0" />
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
									className="text-emerald-600 hover:text-emerald-700 active:scale-95 font-bold flex items-center gap-1 transition-all cursor-pointer hover:bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 ml-2"
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

						<div className="pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-700 hover:!to-teal-700 active:scale-[0.98] !text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/25 transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={13} className="!text-white shrink-0" />
								<span className="!text-white">Ver no Street View</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
}
