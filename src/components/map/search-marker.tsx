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
import {
	formatCoordinates,
	getDirectionsUrl,
	getStreetViewUrl,
} from "@/utils/maps";
import { searchIcon } from "./map-icons";

interface SearchLocation {
	lat: number;
	lon: number;
	address: string;
}

interface SearchMarkerProps {
	location: SearchLocation;
}

export function SearchMarker({ location }: SearchMarkerProps) {
	const { copied, copy } = useClipboard();
	const streetViewUrl = getStreetViewUrl(location.lat, location.lon);
	const directionsUrl = getDirectionsUrl(location.lat, location.lon);
	const formattedCoords = formatCoordinates(location.lat, location.lon);

	const handleCopyCoords = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${location.lat}, ${location.lon}`);
	};

	return (
		<Marker position={[location.lat, location.lon]} icon={searchIcon}>
			<Popup
				autoClose={false}
				closeOnClick={false}
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
				className="!m-0"
			>
				<div className="w-[290px] sm:w-[310px] text-slate-800 font-sans overflow-hidden rounded-2xl">
					<div className="bg-slate-900 text-white px-3.5 py-3 flex items-center gap-1.5">
						<div className="w-6 h-6 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
							<FiMapPin size={13} />
						</div>
						<span className="text-xs font-semibold tracking-wide">
							Local Pesquisado
						</span>
					</div>

					<div className="p-3.5 space-y-3 bg-white">
						<div className="pb-1 border-b border-slate-100">
							<span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 tracking-wider">
								Endereço
							</span>
							<h3 className="font-bold text-sm text-slate-900 leading-snug break-words">
								{location.address}
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
}
