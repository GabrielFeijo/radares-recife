export interface PhotonProperties {
	osm_id?: number;
	name?: string;
	street?: string;
	housenumber?: string;
	city?: string;
	district?: string;
	state?: string;
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
