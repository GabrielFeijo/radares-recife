"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { MAP_DEFAULTS } from "@/constants/map";

interface MapControllerProps {
	center: [number, number];
	zoom: number;
	trigger: number;
}

export function MapController({ center, zoom, trigger }: MapControllerProps) {
	const map = useMap();

	useEffect(() => {
		map.zoomControl.setPosition("bottomright");
	}, [map]);

	useEffect(() => {
		if (trigger) {
			map.flyTo(center, zoom, { duration: MAP_DEFAULTS.flyDuration });
		}
	}, [trigger, center, zoom, map]);

	return null;
}
