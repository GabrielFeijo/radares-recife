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
					className="w-full pl-4 pr-20 py-2.5 sm:py-3 border border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none text-slate-800 placeholder-slate-400 bg-white/95 backdrop-blur-md rounded-xl shadow-md text-sm sm:text-base transition-all"
				/>
				<div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
					{query && (
						<button
							type="button"
							onClick={handleClear}
							className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
							title="Limpar busca"
							aria-label="Limpar busca"
						>
							<FiX
								size={16}
								strokeWidth={2.5}
								className="text-slate-400 hover:text-slate-600"
							/>
						</button>
					)}
					<button
						type="button"
						onClick={() =>
							query.trim().length >= 3 && searchAddress(query.trim())
						}
						className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
						disabled={isLoading || query.trim().length < 3}
						title="Buscar"
						aria-label="Buscar"
					>
						<FiSearch
							size={18}
							strokeWidth={2.5}
							className={isLoading ? "text-slate-300" : "text-slate-600"}
						/>
					</button>
				</div>
			</div>

			{showResults && results.length > 0 && !isLoading && (
				<div className="absolute top-full mt-2 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 max-h-80 overflow-y-auto z-50 p-1.5 space-y-0.5">
					{results.map((result) => (
						<button
							type="button"
							key={result.place_id}
							onClick={() => handleSelectResult(result)}
							className="w-full px-3 py-2.5 text-left hover:bg-blue-50/70 active:bg-blue-100/70 rounded-xl transition-all duration-150 cursor-pointer flex items-start gap-2.5"
						>
							<div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60">
								<FiSearch size={12} />
							</div>
							<span className="text-xs sm:text-sm text-slate-800 font-medium line-clamp-2 leading-snug">
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
					<div className="absolute top-full mt-2 w-full border border-slate-200/80 p-4 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl z-50">
						<p className="text-xs sm:text-sm text-slate-500 text-center font-medium">
							Nenhum resultado encontrado para "{query}"
						</p>
					</div>
				)}

			{isLoading && (
				<div className="absolute top-full mt-2 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 p-2 z-50 space-y-1.5 animate-pulse">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="px-3 py-2.5 flex items-start gap-2.5 rounded-xl border border-transparent"
						>
							<div className="w-6 h-6 rounded-lg bg-slate-200 shrink-0 mt-0.5" />
							<div className="flex-1 space-y-2 py-0.5">
								<div
									className="h-3.5 bg-slate-200 rounded-md"
									style={{ width: `${85 - i * 15}%` }}
								/>
								<div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AddressSearch;
