import type { CKANResponse } from "@/types";

const CKAN_API_URL =
	"https://dados.recife.pe.gov.br/api/action/datastore_search";

export async function fetchFromCKAN<T>(resourceId: string): Promise<T[]> {
	const response = await fetch(CKAN_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)",
		},
		body: JSON.stringify({
			resource_id: resourceId,
		}),
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data: CKANResponse<T> = await response.json();

	if (!data.success || !data.result?.records) {
		throw new Error("Invalid data format from CKAN API");
	}

	return data.result.records;
}
