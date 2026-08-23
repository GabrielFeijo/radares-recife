"use client";

import { FiNavigation } from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";
import type { UserLocation } from "@/hooks/use-geolocation";
import { userLocationIcon } from "./map-icons";
import { PopupActions } from "./popup-actions";
import { PopupGpsRow } from "./popup-gps-row";
import { PopupHeader } from "./popup-header";

interface UserLocationMarkerProps {
	location: UserLocation;
}

export function UserLocationMarker({ location }: UserLocationMarkerProps) {
	return (
		<Marker position={[location.lat, location.lon]} icon={userLocationIcon}>
			<Popup
				closeButton={false}
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
			>
				<div className="w-[290px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category="Sua Localização"
						variant="location"
						icon={<FiNavigation size={12} className="text-emerald-600" />}
						badge="GPS Ativo"
					/>

					<div className="p-3.5 space-y-3">
						<div>
							<span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-0.5">
								Posição do Dispositivo
							</span>
							<h3 className="font-bold text-[13px] text-slate-900 leading-snug">
								Localização Atual
							</h3>
							<p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
								Geolocalização obtida via sensor do navegador
							</p>
						</div>

						{/* GPS coordinates */}
						<PopupGpsRow latitude={location.lat} longitude={location.lon} />

						{/* Action buttons (Street View) */}
						<PopupActions
							latitude={location.lat}
							longitude={location.lon}
							showDirections={false}
							primaryLabel="Ver no Street View"
						/>
					</div>
				</div>
			</Popup>
		</Marker>
	);
}
