"use client";

import { type RefObject, useEffect, useImperativeHandle } from "react";
import { useMap } from "react-leaflet";
import { MAP_DEFAULTS } from "@/constants/map";

export interface MapControllerHandle {
	flyTo: (lat: number, lon: number, zoom: number) => void;
}

interface MapControllerProps {
	controllerRef: RefObject<MapControllerHandle>;
}

export function MapController({ controllerRef }: MapControllerProps) {
	const map = useMap();

	useEffect(() => {
		map.zoomControl.setPosition("bottomright");
	}, [map]);

	useImperativeHandle(
		controllerRef,
		() => ({
			flyTo(lat: number, lon: number, zoom: number) {
				map.flyTo([lat, lon], zoom, { duration: MAP_DEFAULTS.flyDuration });
			},
		}),
		[map],
	);

	return null;
}
