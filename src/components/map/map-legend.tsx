"use client";

import { PiSecurityCameraFill, PiTrafficSignalFill } from "react-icons/pi";

interface MapLegendProps {
	radarCount: number;
	cameraCount: number;
	selectedSpeed: string;
}

export function MapLegend({
	radarCount,
	cameraCount,
	selectedSpeed,
}: MapLegendProps) {
	return (
		<div className="absolute bottom-4 left-3 z-[999] bg-white/95 backdrop-blur-2xl px-4 py-3 rounded-2xl shadow-glass-lg border border-slate-200/90 text-xs">
			<div className="flex items-center gap-3.5 font-semibold text-slate-700">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/30">
						<PiTrafficSignalFill size={13} />
					</div>
					<span className="text-slate-500">Radares</span>
					<strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200/60">
						{radarCount}
					</strong>
					{selectedSpeed !== "all" && (
						<span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
							{selectedSpeed}
						</span>
					)}
				</div>

				<span className="w-px h-4 bg-slate-200" />

				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-lg bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 border border-sky-500/30">
						<PiSecurityCameraFill size={13} />
					</div>
					<span className="text-slate-500">Câmeras</span>
					<strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200/60">
						{cameraCount}
					</strong>
				</div>
			</div>

			<div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
				<span className="flex h-2 w-2 relative">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
					<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
				</span>
				<span>CTTU / Prefeitura da Cidade do Recife • Dados Abertos</span>
			</div>
		</div>
	);
}
