export function getStreetViewUrl(lat: number, lon: number): string {
	return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
}

export function getDirectionsUrl(lat: number, lon: number): string {
	return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export function formatCoordinates(
	lat: number,
	lon: number,
	precision = 5,
): string {
	return `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`;
}
