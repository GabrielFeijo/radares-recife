"use client";

import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useAddressSearch } from "@/hooks/use-address-search";
import type { SearchResult } from "@/types";

interface AddressSearchProps {
	onLocationSelect: (lat: number, lon: number, address: string) => void;
}

export default function AddressSearch({
	onLocationSelect,
}: AddressSearchProps) {
	const {
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
	} = useAddressSearch(onLocationSelect);

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
						onClick={handleSearchManual}
						disabled={isLoading || query.trim().length < 3}
						className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
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
				<ResultsList results={results} onSelect={handleSelectResult} />
			)}

			{showResults &&
				query.trim().length >= 3 &&
				results.length === 0 &&
				!isLoading && (
					<div className="absolute top-full mt-2 w-full border border-slate-200/80 p-4 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl z-50">
						<p className="text-xs sm:text-sm text-slate-500 text-center font-medium">
							Nenhum resultado encontrado para &ldquo;{query}&rdquo;
						</p>
					</div>
				)}

			{isLoading && <LoadingSkeleton />}
		</div>
	);
}

interface ResultsListProps {
	results: SearchResult[];
	onSelect: (result: SearchResult) => void;
}

function ResultsList({ results, onSelect }: ResultsListProps) {
	return (
		<div className="absolute top-full mt-2 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 max-h-80 overflow-y-auto z-50 p-1.5 space-y-0.5">
			{results.map((result) => (
				<button
					type="button"
					key={result.place_id}
					onClick={() => onSelect(result)}
					className="w-full px-3 py-2.5 text-left hover:bg-blue-50/70 active:bg-blue-100/70 rounded-xl transition-all duration-150 cursor-pointer flex items-start gap-2.5"
				>
					<div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60">
						<FiMapPin size={13} />
					</div>
					<span className="text-xs sm:text-sm text-slate-800 font-medium line-clamp-2 leading-snug">
						{result.display_name}
					</span>
				</button>
			))}
		</div>
	);
}

function LoadingSkeleton() {
	return (
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
	);
}
