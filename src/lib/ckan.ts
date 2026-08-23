import type { CKANResponse } from "@/types";

const CKAN_API_URL =
	"https://dados.recife.pe.gov.br/api/action/datastore_search";
const PAGE_SIZE = 1000;

export async function fetchFromCKAN<T>(resourceId: string): Promise<T[]> {
	const allRecords: T[] = [];
	let offset = 0;
	let hasMore = true;

	while (hasMore) {
		const response = await fetch(CKAN_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0 (compatible; RecifeRadaresApp/1.0)",
			},
			body: JSON.stringify({
				resource_id: resourceId,
				limit: PAGE_SIZE,
				offset,
			}),
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`CKAN API error: HTTP ${response.status}`);
		}

		const data: CKANResponse<T> = await response.json();

		if (!data.success || !data.result?.records) {
			throw new Error("Invalid response format from CKAN API");
		}

		const { records } = data.result;
		allRecords.push(...records);

		if (records.length < PAGE_SIZE) {
			hasMore = false;
		} else {
			offset += PAGE_SIZE;
		}
	}

	return allRecords;
}
