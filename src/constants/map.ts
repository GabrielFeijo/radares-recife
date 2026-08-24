export const MAP_DEFAULTS = {
	center: [-8.0584, -34.8848] as [number, number],
	zoom: 13,
	locationZoom: 16,
	searchZoom: 17,
	flyDuration: 1.5,
} as const;

export const MAP_TILES = {
	GOOGLE_MAPS: {
		url: "https://www.google.cn/maps/vt?lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
	},
} as const;

export const CKAN_RESOURCE_IDS = {
	RADARS: "36c2b47b-f439-4895-8b65-3f3dda36a4a7",
	CAMERAS: "3d9a7f0d-cb38-48ee-9e10-d9b83284ae28",
} as const;

export const PHOTON_CONFIG = {
	bbox: "-35.05,-8.18,-34.85,-7.90",
	limit: 5,
	debounceMs: 400,
	minQueryLength: 3,
} as const;

export const GEOLOCATION_CONFIG = {
	enableHighAccuracy: true,
	timeout: 8000,
} as const;
