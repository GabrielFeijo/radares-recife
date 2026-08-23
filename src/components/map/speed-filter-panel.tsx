"use client";

import { FiFilter } from "react-icons/fi";
import type { RadarData } from "@/types";

interface SpeedFilterPanelProps {
	radars: RadarData[];
	availableSpeeds: string[];
	selectedSpeed: string;
	filteredCount: number;
	onSelectSpeed: (speed: string) => void;
}

interface SpeedOptionProps {
	label: string;
	count: number;
	isSelected: boolean;
	onSelect: () => void;
}

function SpeedOption({ label, count, isSelected, onSelect }: SpeedOptionProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
				isSelected
					? "bg-emerald-50 border border-emerald-300/80 text-emerald-800 font-semibold shadow-xs"
					: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent font-medium"
			}`}
		>
			<span className="text-xs">{label}</span>
			<span
				className={`text-[10px] px-2 py-0.5 rounded-lg font-mono font-medium ${
					isSelected
						? "bg-emerald-100/80 text-emerald-800 border border-emerald-200"
						: "bg-slate-100 text-slate-600"
				}`}
			>
				{count}
			</span>
		</button>
	);
}

export function SpeedFilterPanel({
	radars,
	availableSpeeds,
	selectedSpeed,
	filteredCount,
	onSelectSpeed,
}: SpeedFilterPanelProps) {
	return (
		<div className="absolute top-28 sm:top-16 right-3 z-[999] bg-white/95 backdrop-blur-2xl p-3.5 rounded-2xl shadow-glass-lg border border-slate-200/90 flex flex-col gap-1.5 min-w-56 text-xs animate-in fade-in zoom-in-95 duration-150">
			<div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
				<span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
					<FiFilter size={13} className="text-emerald-600" />
					Filtrar por Velocidade
				</span>
				<span className="text-[10px] text-slate-400 font-mono font-medium">
					{filteredCount} exibidos
				</span>
			</div>

			<SpeedOption
				label="Todas as velocidades"
				count={radars.length}
				isSelected={selectedSpeed === "all"}
				onSelect={() => onSelectSpeed("all")}
			/>

			{availableSpeeds.map((speed) => (
				<SpeedOption
					key={speed}
					label={speed}
					count={
						radars.filter((r) => r.monitoredSpeed?.trim() === speed).length
					}
					isSelected={selectedSpeed === speed}
					onSelect={() => onSelectSpeed(speed)}
				/>
			))}
		</div>
	);
}
