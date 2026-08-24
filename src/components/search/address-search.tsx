"use client";

import {
	FiArrowUpRight,
	FiMapPin,
	FiNavigation,
	FiSearch,
	FiX,
} from "react-icons/fi";
import { useAddressSearch } from "@/hooks/use-address-search";
import type { SearchResult } from "@/types";

interface AddressSearchProps {
	onLocationSelect: (lat: number, lon: number, address: string) => void;
}

function parseAddress(displayName: string): {
	title: string;
	subtitle: string;
} {
	const parts = displayName.split(",").map((p) => p.trim());
	if (parts.length <= 1) {
		return {
			title: parts[0] || displayName,
			subtitle: "Recife e Região Metropolitana",
		};
	}

	const title = parts[0];
	const filtered = parts.slice(1).filter((p) => {
		const lower = p.toLowerCase();
		return (
			!lower.includes("região") &&
			!lower.includes("brasil") &&
			!/^\d{5}-?\d{3}$/.test(p)
		);
	});

	const subtitle =
		filtered.length > 0
			? filtered.slice(0, 3).join(", ")
			: "Recife - Pernambuco";

	return { title, subtitle };
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
			<div className="relative group">
				<div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
					<FiSearch size={17} strokeWidth={2.5} />
				</div>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => results.length > 0 && setShowResults(true)}
					placeholder="Buscar rua, avenida ou via no Recife..."
					aria-label="Buscar rua ou avenida no Recife"
					className="w-full pl-10 pr-20 py-2.5 sm:py-3 border border-slate-200 bg-white text-slate-900 placeholder-slate-400 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none text-xs sm:text-sm font-medium transition-all"
				/>
				<div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
					{query && (
						<button
							type="button"
							onClick={handleClear}
							className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
							title="Limpar busca"
							aria-label="Limpar busca"
						>
							<FiX size={15} strokeWidth={2.5} />
						</button>
					)}
					<button
						type="button"
						onClick={handleSearchManual}
						disabled={isLoading || query.trim().length < 3}
						className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl border border-slate-200 transition-all cursor-pointer"
						title="Buscar"
						aria-label="Buscar"
					>
						<FiNavigation size={14} />
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
					<div className="absolute top-full mt-2 w-full border border-slate-200 p-4 bg-white rounded-2xl shadow-xl z-50">
						<p className="text-xs sm:text-sm text-slate-500 text-center font-medium">
							Nenhuma rua ou avenida encontrada para &ldquo;{query}&rdquo;
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
		<div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 space-y-1.5 overflow-hidden">
			<div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
					<span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
						Ruas e Avenidas no Recife / RMR
					</span>
				</div>
				<span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
					{results.length} {results.length === 1 ? "via" : "vias"}
				</span>
			</div>

			<div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
				{results.map((result) => {
					const { title, subtitle } = parseAddress(result.display_name);
					return (
						<button
							type="button"
							key={result.place_id}
							onClick={() => onSelect(result)}
							className="w-full p-2.5 text-left rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group/item hover:bg-slate-50 active:bg-slate-100 border border-transparent hover:border-slate-200"
						>
							<div className="flex items-start gap-2.5 min-w-0 flex-1">
								<div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
									<FiMapPin size={14} className="shrink-0" />
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover/item:text-blue-600 leading-snug truncate">
										{title}
									</h4>
									<p className="text-[11px] text-slate-500 font-medium leading-tight truncate mt-0.5">
										{subtitle}
									</p>
								</div>
							</div>
							<div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 group-hover/item:text-blue-600 transition-all shrink-0">
								<FiArrowUpRight size={14} strokeWidth={2.5} />
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 space-y-1.5 animate-pulse">
			<div className="px-3 py-2 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
				<div className="h-2.5 bg-slate-200 rounded w-28" />
				<div className="h-3.5 bg-slate-200 rounded-full w-12" />
			</div>
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="p-2.5 flex items-start gap-2.5 rounded-xl border border-transparent"
				>
					<div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0 mt-0.5" />
					<div className="flex-1 space-y-1.5 py-0.5">
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
