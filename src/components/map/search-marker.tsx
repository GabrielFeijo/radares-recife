"use client";

import { Marker, Popup } from "react-leaflet";
import type { SearchLocation } from "@/types";
import { searchIcon } from "./map-icons";
import { PopupActions } from "./popup-actions";
import { PopupGpsRow } from "./popup-gps-row";
import { PopupHeader } from "./popup-header";

interface SearchMarkerProps {
	location: SearchLocation;
}

function parseSearchAddress(address: string): {
	title: string;
	subtitle?: string;
} {
	const parts = address.split(",").map((p) => p.trim());
	if (parts.length <= 1) {
		return { title: address };
	}
	return {
		title: parts[0],
		subtitle: parts.slice(1).join(", "),
	};
}

export function SearchMarker({ location }: SearchMarkerProps) {
	const { title, subtitle } = parseSearchAddress(location.address);

	return (
		<Marker position={[location.lat, location.lon]} icon={searchIcon}>
			<Popup
				autoClose={true}
				closeButton={false}
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
			>
				<div className="w-[305px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category="Local Pesquisado"
						variant="search"
						badge="Destino"
					/>

					<div className="p-3.5 space-y-3">
						<div>
							<h3 className="font-bold text-[13.5px] text-slate-900 leading-snug break-words">
								{title}
							</h3>
							{subtitle && (
								<p className="text-[11px] text-slate-500 font-medium leading-snug mt-1 break-words">
									{subtitle}
								</p>
							)}
						</div>

						<PopupGpsRow latitude={location.lat} longitude={location.lon} />

						<PopupActions latitude={location.lat} longitude={location.lon} />
					</div>
				</div>
			</Popup>
		</Marker>
	);
}
