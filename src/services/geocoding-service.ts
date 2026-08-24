import { PHOTON_CONFIG } from "@/constants/map";
import type { PhotonFeature, PhotonResponse, SearchResult } from "@/types";

function buildStreetDisplayName(feature: PhotonFeature): {
	title: string;
	subtitle: string;
	fullName: string;
} {
	const { properties: props } = feature;
	const streetName = props.name || props.street || "Via sem nome";
	const locationParts: string[] = [];

	const neighborhood = props.district || props.locality;
	if (neighborhood) locationParts.push(neighborhood);
	if (props.city) locationParts.push(props.city);
	if (props.state) locationParts.push(props.state);

	const subtitle =
		locationParts.length > 0 ? locationParts.join(", ") : "Recife - Pernambuco";

	const fullName = `${streetName}, ${subtitle}`;

	return {
		title: streetName,
		subtitle,
		fullName,
	};
}

function mapAndDeduplicatePhotonFeatures(
	features: PhotonFeature[],
): SearchResult[] {
	const seenKeys = new Set<string>();
	const results: SearchResult[] = [];

	for (let i = 0; i < features.length; i++) {
		const feature = features[i];
		const { title, subtitle, fullName } = buildStreetDisplayName(feature);

		const dedupKey = `${title.toLowerCase()}|${subtitle.toLowerCase()}`;
		if (seenKeys.has(dedupKey)) {
			continue;
		}
		seenKeys.add(dedupKey);

		results.push({
			place_id: feature.properties.osm_id
				? String(feature.properties.osm_id)
				: `street-${i}`,
			display_name: fullName,
			lat: String(feature.geometry.coordinates[1]),
			lon: String(feature.geometry.coordinates[0]),
		});

		if (results.length >= PHOTON_CONFIG.limit) {
			break;
		}
	}

	return results;
}

export async function searchAddressByQuery(
	searchQuery: string,
	signal?: AbortSignal,
): Promise<SearchResult[]> {
	const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
		searchQuery,
	)}&bbox=${PHOTON_CONFIG.bbox}&limit=15&osm_tag=highway`;
	const response = await fetch(url, { signal });

	if (!response.ok) {
		throw new Error(`Photon geocoding error: HTTP ${response.status}`);
	}

	const data: PhotonResponse = await response.json();
	return mapAndDeduplicatePhotonFeatures(data.features || []);
}
