"use client";

import type React from "react";
import { FiCheck, FiCopy, FiMapPin } from "react-icons/fi";
import { useClipboard } from "@/hooks/use-clipboard";
import { formatCoordinates } from "@/utils/maps";

interface PopupGpsRowProps {
	latitude: number;
	longitude: number;
}

export function PopupGpsRow({ latitude, longitude }: PopupGpsRowProps) {
	const { copied, copy } = useClipboard();
	const formattedCoords = formatCoordinates(latitude, longitude);

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${latitude}, ${longitude}`);
	};

	return (
		<div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
			<div className="flex items-center gap-1.5 min-w-0 text-slate-500 font-medium">
				<FiMapPin size={12} className="text-slate-400 shrink-0" />
				<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
					GPS
				</span>
				<span className="font-mono text-slate-700 text-[10.5px] truncate">
					{formattedCoords}
				</span>
			</div>

			<button
				type="button"
				onClick={handleCopy}
				className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer shrink-0 ml-2 ${
					copied
						? "bg-emerald-50 text-emerald-700 font-semibold"
						: "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
				}`}
				title="Copiar coordenadas GPS"
				aria-label="Copiar coordenadas GPS"
			>
				{copied ? (
					<>
						<FiCheck size={11} className="text-emerald-600" />
						<span>Copiado</span>
					</>
				) : (
					<>
						<FiCopy size={10} />
						<span>Copiar</span>
					</>
				)}
			</button>
		</div>
	);
}
