"use client";

import L from "leaflet";
import { FiExternalLink, FiMapPin } from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";

const searchIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
			<path fill="#ef4444" stroke="#991b1b" stroke-width="2" d="M20 1 C9 1 1 9 1 20 C1 31 20 49 20 49 S39 31 39 20 C39 9 31 1 20 1 Z"/>
			<circle cx="20" cy="20" r="8" fill="white"/>
		</svg>
	`),
	iconSize: [30, 40],
	iconAnchor: [15, 40],
	popupAnchor: [0, -40],
});

interface SearchLocation {
	lat: number;
	lon: number;
	address: string;
}

interface SearchMarkerProps {
	location: SearchLocation;
}

export function SearchMarker({ location }: SearchMarkerProps) {
	const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.lat},${location.lon}`;

	return (
		<Marker position={[location.lat, location.lon]} icon={searchIcon}>
			<Popup autoClose={false} closeOnClick={false}>
				<div className="w-72 sm:w-80 text-slate-800 font-sans p-4 space-y-3">
					<div className="border-b border-slate-100 pb-2.5 flex items-start gap-2">
						<div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200/60">
							<FiMapPin size={16} />
						</div>
						<div>
							<span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
								Local Pesquisado
							</span>
							<h3 className="font-bold text-sm text-slate-900 leading-snug">
								{location.address}
							</h3>
						</div>
					</div>

					<div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-xs">
						<span className="text-[10px] text-slate-500 font-medium">
							Coordenadas GPS
						</span>
						<p className="font-semibold text-slate-800">
							{location.lat.toFixed(5)}, {location.lon.toFixed(5)}
						</p>
					</div>

					<a
						href={streetViewUrl}
						target="_blank"
						rel="noreferrer"
						className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
					>
						<span>Abrir no Google Street View</span>
						<FiExternalLink size={13} />
					</a>
				</div>
			</Popup>
		</Marker>
	);
}
