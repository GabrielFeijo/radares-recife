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
			<Popup autoClose={false} closeOnClick={false} className="!m-0">
				<div className="w-[300px] sm:w-[330px] text-slate-800 font-sans p-4 space-y-3">
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-50/90 text-red-700 border border-red-200/70 shadow-xs">
							<FiMapPin size={13} className="shrink-0 text-red-600" />
							Local Pesquisado
						</span>
					</div>

					<div className="pt-0.5 pb-2 border-b border-slate-100">
						<span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
							Endereço
						</span>
						<h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug break-words">
							{location.address}
						</h3>
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
}
