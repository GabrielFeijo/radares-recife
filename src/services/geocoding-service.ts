import { PHOTON_CONFIG } from "@/constants/map";
import type { PhotonFeature, PhotonResponse, SearchResult } from "@/types";

function buildDisplayName(feature: PhotonFeature): string {
	const { properties: props } = feature;
	const parts: string[] = [];

	if (props.name) parts.push(props.name);
	if (props.street) {
		parts.push(
			props.housenumber
				? `${props.street}, ${props.housenumber}`
				: props.street,
		);
	}
	if (!props.street && props.city && !props.name) parts.push(props.city);
	if (props.district) parts.push(props.district);
	if (props.city && props.state) parts.push(`${props.city} - ${props.state}`);

	return Array.from(new Set(parts)).join(", ") || "Localização no Recife";
}

function mapPhotonFeatures(features: PhotonFeature[]): SearchResult[] {
	return features.map((feature, i) => ({
		place_id: feature.properties.osm_id
			? String(feature.properties.osm_id)
			: `result-${i}`,
		display_name: buildDisplayName(feature),
		lat: String(feature.geometry.coordinates[1]),
		lon: String(feature.geometry.coordinates[0]),
	}));
}

export async function searchAddressByQuery(
	searchQuery: string,
	signal?: AbortSignal,
): Promise<SearchResult[]> {
	const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&bbox=${PHOTON_CONFIG.bbox}&limit=${PHOTON_CONFIG.limit}`;
	const response = await fetch(url, { signal });

	if (!response.ok) {
		throw new Error(`Photon geocoding error: HTTP ${response.status}`);
	}

	const data: PhotonResponse = await response.json();
	return mapPhotonFeatures(data.features || []);
}
