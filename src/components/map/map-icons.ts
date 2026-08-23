import L from "leaflet";

export const radarIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
			<defs>
				<filter id="pinShadow" x="-30%" y="-20%" width="160%" height="150%">
					<feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0f172a" flood-opacity="0.3"/>
				</filter>
				<linearGradient id="radarPinGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#fb923c"/>
					<stop offset="100%" stop-color="#ea580c"/>
				</linearGradient>
			</defs>
			<ellipse cx="20" cy="45" rx="8" ry="3" fill="#0f172a" fill-opacity="0.25"/>
			<path fill="url(#radarPinGrad)" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" filter="url(#pinShadow)"
				d="M20 2 C10.059 2 2 10.059 2 20 C2 31.5 20 44 20 44 S38 31.5 38 20 C38 10.059 29.941 2 20 2 Z"/>
			<circle cx="20" cy="18.5" r="11" fill="#ffffff"/>
			<g>
				<path d="M 12.5 22.5 A 8.5 8.5 0 0 1 20 11.5" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
				<path d="M 20 11.5 A 8.5 8.5 0 0 1 27.5 22.5" fill="none" stroke="#ea580c" stroke-width="2.4" stroke-linecap="round"/>
				<line x1="14.5" y1="17" x2="16" y2="18" stroke="#0f172a" stroke-width="1.2" stroke-linecap="round"/>
				<line x1="20" y1="12" x2="20" y2="14" stroke="#ea580c" stroke-width="1.4" stroke-linecap="round"/>
				<line x1="25.5" y1="17" x2="24" y2="18" stroke="#ea580c" stroke-width="1.2" stroke-linecap="round"/>
				<circle cx="20" cy="21" r="2.8" fill="#0f172a"/>
				<line x1="20" y1="21" x2="25" y2="14.5" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round"/>
				<circle cx="20" cy="21" r="1.1" fill="#ffffff"/>
			</g>
		</svg>
	`),
	iconSize: [34, 42],
	iconAnchor: [17, 42],
	popupAnchor: [0, -42],
});

export const cameraIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
			<defs>
				<filter id="camPinShadow" x="-30%" y="-20%" width="160%" height="150%">
					<feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0f172a" flood-opacity="0.3"/>
				</filter>
				<linearGradient id="camPinGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#38bdf8"/>
					<stop offset="100%" stop-color="#0284c7"/>
				</linearGradient>
			</defs>
			<ellipse cx="20" cy="45" rx="8" ry="3" fill="#0f172a" fill-opacity="0.25"/>
			<path fill="url(#camPinGrad)" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" filter="url(#camPinShadow)"
				d="M20 2 C10.059 2 2 10.059 2 20 C2 31.5 20 44 20 44 S38 31.5 38 20 C38 10.059 29.941 2 20 2 Z"/>
			<circle cx="20" cy="18.5" r="11" fill="#ffffff"/>
			<g transform="translate(11, 10.5) scale(0.75)">
				<path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" fill="#0f172a"/>
				<path d="M17 7.5l5-3v9l-5-3v-3z" fill="#0f172a"/>
				<circle cx="8.5" cy="8.5" r="2.8" fill="#0284c7"/>
				<circle cx="8.5" cy="8.5" r="1.2" fill="#ffffff"/>
				<path d="M5.5 15v2.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V15" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" fill="none"/>
			</g>
		</svg>
	`),
	iconSize: [34, 42],
	iconAnchor: [17, 42],
	popupAnchor: [0, -42],
});

export const searchIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
			<defs>
				<filter id="searchPinShadow" x="-30%" y="-20%" width="160%" height="150%">
					<feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0f172a" flood-opacity="0.3"/>
				</filter>
				<linearGradient id="purplePinGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#a855f7"/>
					<stop offset="100%" stop-color="#6366f1"/>
				</linearGradient>
			</defs>
			<ellipse cx="20" cy="45" rx="8" ry="3" fill="#0f172a" fill-opacity="0.25"/>
			<path fill="url(#purplePinGrad)" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round" filter="url(#searchPinShadow)"
				d="M20 2 C10.059 2 2 10.059 2 20 C2 31.5 20 44 20 44 S38 31.5 38 20 C38 10.059 29.941 2 20 2 Z"/>
			<circle cx="20" cy="18.5" r="11" fill="#ffffff"/>
			<circle cx="20" cy="18.5" r="5.5" fill="#6366f1"/>
			<circle cx="20" cy="18.5" r="2.5" fill="#ffffff"/>
		</svg>
	`),
	iconSize: [34, 42],
	iconAnchor: [17, 42],
	popupAnchor: [0, -42],
});

export const userLocationIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
			<defs>
				<filter id="userGlow" x="-30%" y="-30%" width="160%" height="160%">
					<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#10b981" flood-opacity="0.4"/>
				</filter>
			</defs>
			<circle cx="24" cy="24" r="21" fill="#10b981" fill-opacity="0.18"/>
			<circle cx="24" cy="24" r="15" fill="#10b981" fill-opacity="0.32" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,3"/>
			<circle cx="24" cy="24" r="8" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#userGlow)"/>
			<circle cx="24" cy="24" r="3" fill="#ffffff"/>
		</svg>
	`),
	iconSize: [44, 44],
	iconAnchor: [22, 22],
	popupAnchor: [0, -22],
});

export function createRadarClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
	const count = cluster.getChildCount();
	let size = 36;
	if (count >= 100) size = 44;
	else if (count >= 10) size = 40;

	return L.divIcon({
		html: `<div class="radar-cluster-badge" style="width:${size}px; height:${size}px;">
			<span class="cluster-count">${count}</span>
		</div>`,
		className: "radar-cluster-container",
		iconSize: L.point(size, size, true),
	});
}

export function createCameraClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
	const count = cluster.getChildCount();
	let size = 36;
	if (count >= 100) size = 44;
	else if (count >= 10) size = 40;

	return L.divIcon({
		html: `<div class="camera-cluster-badge" style="width:${size}px; height:${size}px;">
			<span class="cluster-count">${count}</span>
		</div>`,
		className: "camera-cluster-container",
		iconSize: L.point(size, size, true),
	});
}
