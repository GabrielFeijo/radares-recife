"use client";

import L from "leaflet";
import { FiNavigation } from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";
import type { UserLocation } from "@/hooks/use-geolocation";

const userLocationIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
			<circle cx="18" cy="18" r="14" fill="#3b82f6" fill-opacity="0.3"/>
			<circle cx="18" cy="18" r="8" fill="#2563eb" stroke="white" stroke-width="2.5"/>
		</svg>
	`),
	iconSize: [36, 36],
	iconAnchor: [18, 18],
	popupAnchor: [0, -18],
});

interface UserLocationMarkerProps {
	location: UserLocation;
}

export function UserLocationMarker({ location }: UserLocationMarkerProps) {
	return (
		<Marker position={[location.lat, location.lon]} icon={userLocationIcon}>
			<Popup closeButton={false}>
				<div className="w-64 text-slate-800 font-sans space-y-2">
					<div className="flex items-center gap-2 border-b border-slate-100 pb-2">
						<div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
							<FiNavigation size={15} />
						</div>
						<div>
							<span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
								Sua Posição
							</span>
							<h3 className="font-bold text-sm text-slate-900">
								Localização Atual
							</h3>
						</div>
					</div>
					<p className="text-xs text-slate-600">
						Coordenadas:{" "}
						<strong>
							{location.lat.toFixed(5)}, {location.lon.toFixed(5)}
						</strong>
					</p>
				</div>
			</Popup>
		</Marker>
	);
}
