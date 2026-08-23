import L from "leaflet";

export const radarIcon = new L.Icon({
	iconUrl: "/radar.png",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16],
});

export const cameraIcon = new L.Icon({
	iconUrl: "/camera.png",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16],
});

export const searchIcon = new L.Icon({
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

export const userLocationIcon = new L.Icon({
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
