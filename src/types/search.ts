export interface SearchResult {
	place_id: string;
	display_name: string;
	lat: string;
	lon: string;
}

export interface SearchLocation {
	lat: number;
	lon: number;
	address: string;
}
