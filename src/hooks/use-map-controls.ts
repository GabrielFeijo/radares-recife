"use client";

import { useMemo, useState } from "react";
import type { RadarData } from "@/types";

export interface MapControlsState {
	showRadars: boolean;
	showCameras: boolean;
	showSpeedLabels: boolean;
	selectedSpeed: string;
	showSpeedFilter: boolean;
	availableSpeeds: string[];
	filteredRadars: RadarData[];
	toggleRadars: () => void;
	toggleCameras: () => void;
	toggleSpeedLabels: () => void;
	toggleSpeedFilter: () => void;
	selectSpeed: (speed: string) => void;
}

export function useMapControls(radars: RadarData[]): MapControlsState {
	const [showRadars, setShowRadars] = useState(true);
	const [showCameras, setShowCameras] = useState(false);
	const [showSpeedLabels, setShowSpeedLabels] = useState(false);
	const [selectedSpeed, setSelectedSpeed] = useState("all");
	const [showSpeedFilter, setShowSpeedFilter] = useState(false);

	const availableSpeeds = useMemo(() => {
		const speeds = new Set<string>();
		for (const r of radars) {
			if (r.monitoredSpeed) speeds.add(r.monitoredSpeed.trim());
		}
		return Array.from(speeds).sort();
	}, [radars]);

	const filteredRadars = useMemo(() => {
		if (selectedSpeed === "all") return radars;
		return radars.filter((r) => r.monitoredSpeed?.trim() === selectedSpeed);
	}, [radars, selectedSpeed]);

	return {
		showRadars,
		showCameras,
		showSpeedLabels,
		selectedSpeed,
		showSpeedFilter,
		availableSpeeds,
		filteredRadars,
		toggleRadars: () => setShowRadars((v) => !v),
		toggleCameras: () => setShowCameras((v) => !v),
		toggleSpeedLabels: () => setShowSpeedLabels((v) => !v),
		toggleSpeedFilter: () => setShowSpeedFilter((v) => !v),
		selectSpeed: setSelectedSpeed,
	};
}
