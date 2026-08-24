"use client";

import type React from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useClipboard } from "@/hooks/use-clipboard";
import { formatCoordinates } from "@/utils/maps";

interface PopupGpsRowProps {
	latitude: number;
	longitude: number;
}

export function PopupGpsRow({ latitude, longitude }: PopupGpsRowProps) {
	const { copied, copy } = useClipboard();
	const formattedCoords = formatCoordinates(latitude, longitude, 5);

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${latitude}, ${longitude}`);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer border ${
				copied
					? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
					: "bg-slate-50/80 hover:bg-slate-100/90 border-slate-100 hover:border-slate-200 text-slate-600"
			}`}
			title="Clique para copiar coordenadas GPS"
			aria-label="Copiar coordenadas GPS"
		>
			<div className="flex items-center gap-2 min-w-0">
				<span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono shrink-0">
					GPS
				</span>
				<span className="font-mono text-[11px] font-medium text-slate-700 truncate tracking-tight">
					{formattedCoords}
				</span>
			</div>

			<span className="inline-flex items-center gap-1 text-[10px] font-semibold shrink-0 transition-transform group-hover:scale-105">
				{copied ? (
					<>
						<FiCheck size={11} className="text-emerald-600" />
						<span className="text-emerald-700">Copiado</span>
					</>
				) : (
					<>
						<FiCopy
							size={11}
							className="text-slate-400 group-hover:text-slate-600"
						/>
						<span className="text-slate-400 group-hover:text-slate-700">
							Copiar
						</span>
					</>
				)}
			</span>
		</button>
	);
}
