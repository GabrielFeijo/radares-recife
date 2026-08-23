"use client";

import { FiCheckCircle } from "react-icons/fi";
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
		<div className="absolute bottom-4 left-3 z-[999] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-200/80 text-xs">
			<div className="flex items-center gap-3 font-semibold text-slate-800">
				<span className="flex items-center gap-1.5">
					<PiTrafficSignalFill size={15} className="text-amber-500 shrink-0" />
					Radares: <strong className="text-slate-900">{radarCount}</strong>
					{selectedSpeed !== "all" && (
						<span className="text-[11px] font-normal text-slate-500">
							({selectedSpeed})
						</span>
					)}
				</span>
				<span className="text-slate-200">|</span>
				<span className="flex items-center gap-1.5">
					<PiSecurityCameraFill size={15} className="text-blue-500 shrink-0" />
					Câmeras: <strong className="text-slate-900">{cameraCount}</strong>
				</span>
			</div>
			<p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
				<FiCheckCircle size={12} className="text-emerald-500 shrink-0" />
				Dados oficiais CTTU / Prefeitura do Recife
			</p>
		</div>
	);
}
