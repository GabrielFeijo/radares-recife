import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import type {
	AddressSearchProps,
	PhotonFeature,
	PhotonResponse,
	SearchResult,
} from "@/types";

const AddressSearch: React.FC<AddressSearchProps> = ({ onLocationSelect }) => {
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
			if (event.key === "Escape") {
				setShowResults(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const searchAddress = useCallback(async (searchQuery: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();

		setIsLoading(true);
		try {
			const response = await fetch(
				`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&bbox=-35.05,-8.18,-34.85,-7.90&limit=5`,
				{ signal: abortControllerRef.current.signal },
			);

			if (response.ok) {
				const data: PhotonResponse = await response.json();

				const formattedResults: SearchResult[] = data.features.map(
					(feature: PhotonFeature) => {
						const props = feature.properties;
						const coords = feature.geometry.coordinates;

						const parts: string[] = [];
						if (props.name) {
							parts.push(props.name);
						}
						if (props.street) {
							const streetStr = props.housenumber
								? `${props.street}, ${props.housenumber}`
								: props.street;
							parts.push(streetStr);
						}
						if (!props.street && props.city && !props.name) {
							parts.push(props.city);
						}
						if (props.district) {
							parts.push(props.district);
						}
						if (props.city && props.state) {
							parts.push(`${props.city} - ${props.state}`);
						}

						const uniqueParts = Array.from(new Set(parts));

						return {
							place_id: props.osm_id || Math.floor(Math.random() * 10000000),
							display_name: uniqueParts.join(", ") || "Localização no Recife",
							lat: coords[1].toString(),
							lon: coords[0].toString(),
						};
					},
				);

				setResults(formattedResults);
				setShowResults(true);
			}
		} catch (error) {
			if ((error as Error)?.name !== "AbortError") {
				console.error("Erro ao buscar endereço:", error);
				setResults([]);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (query.trim().length < 3) {
			setResults([]);
			setIsLoading(false);
			return;
		}

		const timeoutId = setTimeout(() => {
			searchAddress(query.trim());
		}, 400);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [query, searchAddress]);

	const handleSelectResult = (result: SearchResult) => {
		const lat = Number.parseFloat(result.lat);
		const lon = Number.parseFloat(result.lon);
		onLocationSelect(lat, lon, result.display_name);
		setShowResults(false);
		setResults([]);
	};

	const handleClear = () => {
		setQuery("");
		setResults([]);
		setShowResults(false);
	};

	return (
		<div ref={searchRef} className="relative w-full">
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => results.length > 0 && setShowResults(true)}
					placeholder="Buscar endereço ou via no Recife..."
					aria-label="Buscar endereço no Recife"
					className="w-full pl-4 pr-20 py-2.5 sm:py-3 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-800 placeholder-gray-500 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-sm sm:text-base transition-all"
				/>
				<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
					{query && (
						<button
							type="button"
							onClick={handleClear}
							className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
							title="Limpar busca"
							aria-label="Limpar busca"
						>
							<FiX
								size={16}
								strokeWidth={2.5}
								className="text-gray-500 hover:text-gray-700"
							/>
						</button>
					)}
					<button
						type="button"
						onClick={() =>
							query.trim().length >= 3 && searchAddress(query.trim())
						}
						className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
						disabled={isLoading || query.trim().length < 3}
						title="Buscar"
						aria-label="Buscar"
					>
						<FiSearch
							size={18}
							strokeWidth={2.5}
							className={isLoading ? "text-gray-400" : "text-gray-600"}
						/>
					</button>
				</div>
			</div>

			{showResults && results.length > 0 && !isLoading && (
				<div className="absolute top-full mt-1.5 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-72 overflow-y-auto z-50">
					{results.map((result) => (
						<button
							type="button"
							key={result.place_id}
							onClick={() => handleSelectResult(result)}
							className="w-full px-4 py-2.5 text-left hover:bg-blue-50/60 transition-colors border-b border-gray-100 last:border-0 cursor-pointer flex items-start gap-2"
						>
							<span className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-2">
								{result.display_name}
							</span>
						</button>
					))}
				</div>
			)}

			{showResults &&
				query.trim().length >= 3 &&
				results.length === 0 &&
				!isLoading && (
					<div className="absolute top-full mt-1.5 w-full border border-gray-200 p-3 bg-white/95 rounded-lg shadow-xl z-50">
						<p className="text-xs sm:text-sm text-gray-600 text-center">
							Nenhum resultado encontrado para "{query}"
						</p>
					</div>
				)}

			{isLoading && (
				<div className="absolute top-full mt-1.5 w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-2 z-50 space-y-1 animate-pulse">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="px-3 py-2.5 flex items-start gap-2.5 border-b border-gray-100 last:border-0"
						>
							<div className="w-4 h-4 rounded bg-gray-200 shrink-0 mt-0.5" />
							<div className="flex-1 space-y-1.5">
								<div
									className="h-3.5 bg-gray-200 rounded"
									style={{ width: `${80 - i * 15}%` }}
								/>
								<div className="h-2.5 bg-gray-100 rounded w-1/2" />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AddressSearch;
