"use client";

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
				<div className="w-[305px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category="Sua Localização"
						variant="location"
						badge="Ao Vivo"
					/>

					<div className="p-3.5 space-y-3">
						<div>
							<h3 className="font-bold text-[13.5px] text-slate-900 leading-snug">
								Localização Atual
							</h3>
							<p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
								Geolocalização obtida via sensor do navegador
							</p>
						</div>

						<PopupGpsRow latitude={location.lat} longitude={location.lon} />

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
