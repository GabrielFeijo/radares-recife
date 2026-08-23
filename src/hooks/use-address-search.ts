"use client";

import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { PHOTON_CONFIG } from "@/constants/map";
import { searchAddressByQuery } from "@/services/geocoding-service";
import type { SearchResult } from "@/types";

type LocationSelectFn = (lat: number, lon: number, address: string) => void;

export interface UseAddressSearchReturn {
	query: string;
	setQuery: (q: string) => void;
	results: SearchResult[];
	isLoading: boolean;
	showResults: boolean;
	setShowResults: (v: boolean) => void;
	handleSelectResult: (result: SearchResult) => void;
	handleClear: () => void;
	handleSearchManual: () => void;
	searchRef: RefObject<HTMLDivElement>;
}

export function useAddressSearch(
	onLocationSelect: LocationSelectFn,
): UseAddressSearchReturn {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);

	const searchRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setShowResults(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const searchAddress = useCallback(async (searchQuery: string) => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = new AbortController();

		setIsLoading(true);
		try {
			const data = await searchAddressByQuery(
				searchQuery,
				abortControllerRef.current.signal,
			);
			setResults(data);
			setShowResults(true);
		} catch (error) {
			if ((error as Error)?.name !== "AbortError") {
				setResults([]);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (query.trim().length < PHOTON_CONFIG.minQueryLength) {
			setResults([]);
			setIsLoading(false);
			return;
		}
		const id = setTimeout(
			() => searchAddress(query.trim()),
			PHOTON_CONFIG.debounceMs,
		);
		return () => clearTimeout(id);
	}, [query, searchAddress]);

	const handleSelectResult = useCallback(
		(result: SearchResult) => {
			onLocationSelect(
				Number.parseFloat(result.lat),
				Number.parseFloat(result.lon),
				result.display_name,
			);
			setShowResults(false);
			setResults([]);
		},
		[onLocationSelect],
	);

	const handleClear = useCallback(() => {
		setQuery("");
		setResults([]);
		setShowResults(false);
	}, []);

	const handleSearchManual = useCallback(() => {
		if (query.trim().length >= PHOTON_CONFIG.minQueryLength) {
			searchAddress(query.trim());
		}
	}, [query, searchAddress]);

	return {
		query,
		setQuery,
		results,
		isLoading,
		showResults,
		setShowResults,
		handleSelectResult,
		handleClear,
		handleSearchManual,
		searchRef,
	};
}
