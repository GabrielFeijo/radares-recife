"use client";

import { FiNavigation } from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";
import type { UserLocation } from "@/hooks/use-geolocation";
import { formatCoordinates } from "@/utils/maps";
import { userLocationIcon } from "./map-icons";

interface UserLocationMarkerProps {
	location: UserLocation;
}

export function UserLocationMarker({ location }: UserLocationMarkerProps) {
	const formattedCoords = formatCoordinates(location.lat, location.lon);

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
						Coordenadas: <strong>{formattedCoords}</strong>
					</p>
				</div>
			</Popup>
		</Marker>
	);
}
