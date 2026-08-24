export interface PhotonProperties {
	osm_id?: number;
	osm_key?: string;
	osm_value?: string;
	type?: string;
	name?: string;
	street?: string;
	housenumber?: string;
	district?: string;
	locality?: string;
	city?: string;
	state?: string;
	country?: string;
	postcode?: string;
}

export interface PhotonFeature {
	properties: PhotonProperties;
	geometry: {
		coordinates: [number, number];
	};
}

export interface PhotonResponse {
	features: PhotonFeature[];
}
