export interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

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

export interface AddressSearchProps {
    onLocationSelect: (lat: number, lon: number, address: string) => void;
}
