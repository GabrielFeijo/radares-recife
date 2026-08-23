"use client";

import type React from "react";
import {
	FiCheck,
	FiCompass,
	FiCopy,
	FiExternalLink,
	FiMapPin,
	FiNavigation,
} from "react-icons/fi";
import { PiGaugeBold, PiRoadHorizonBold } from "react-icons/pi";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { useClipboard } from "@/hooks/use-clipboard";
import type { RadarData } from "@/types";
import {
	formatCoordinates,
	getDirectionsUrl,
	getStreetViewUrl,
} from "@/utils/maps";
import { radarIcon } from "./map-icons";

interface RadarMarkerProps {
	radar: RadarData;
	showLabel?: boolean;
}

interface SpeedBadgeInfo {
	display: string;
	unit: string;
	textSize: string;
	label: string;
}

function getSpeedBadgeInfo(speed?: string): SpeedBadgeInfo {
	if (!speed?.trim()) {
		return {
			display: "—",
			unit: "",
			textSize: "text-xs",
			label: "Radar",
		};
	}

	const raw = speed.trim();

	// Remove all variations of km/h, kmh (case-insensitive, global) for the badge
	const clean = raw
		.replace(/km\s*\/\s*h/gi, "")
		.replace(/kmh/gi, "")
		.trim();

	// Choose font size based on text length so "40 e 60" or single numbers fit without overflow
	let textSize = "text-sm";
	if (clean.length > 7) {
		textSize = "text-[8.5px]";
	} else if (clean.length > 4) {
		textSize = "text-[9.5px]";
	} else if (clean.length > 2) {
		textSize = "text-xs";
	}

	return {
		display: clean || "—",
		unit: "KM/H",
		textSize,
		label: raw,
	};
}

export const RadarMarker: React.FC<RadarMarkerProps> = ({
	radar,
	showLabel = false,
}) => {
	const { copied, copy } = useClipboard();
	const speedInfo = getSpeedBadgeInfo(radar.monitoredSpeed);

	const handleCopyCoords = (e: React.MouseEvent) => {
		e.stopPropagation();
		copy(`${radar.latitude}, ${radar.longitude}`);
	};

	const streetViewUrl = getStreetViewUrl(radar.latitude, radar.longitude);
	const directionsUrl = getDirectionsUrl(radar.latitude, radar.longitude);
	const formattedCoords = formatCoordinates(radar.latitude, radar.longitude);

	return (
		<Marker
			position={[radar.latitude, radar.longitude]}
			title={`${radar.installationLocation} (${radar.monitoredSpeed})`}
			icon={radarIcon}
		>
			<Tooltip
				key={showLabel ? "permanent" : "hover"}
				offset={[16, 0]}
				opacity={0.95}
				permanent={showLabel}
				direction="right"
				className="font-bold"
			>
				{radar.monitoredSpeed}
			</Tooltip>

			<Popup
				closeButton={false}
				autoClose
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
			>
				<div className="text-slate-800 font-sans min-w-[290px] max-w-[340px] overflow-hidden">
					<div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white px-3.5 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800">
						<div className="flex items-center gap-1.5 min-w-0">
							<span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
							<span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 truncate">
								{radar.equipmentType || "Radar de Trânsito"}
							</span>
						</div>
						<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-bold shrink-0">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
							<span>CTTU RECIFE</span>
						</div>
					</div>

					<div className="p-3.5 space-y-2.5 bg-white">
						<div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100">
							<div className="flex-1 min-w-0 pt-0.5">
								<span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-0.5">
									<FiMapPin size={10} className="text-blue-600" />
									Local da Fiscalização
								</span>
								<h3 className="font-extrabold text-[13.5px] text-slate-900 leading-snug break-words">
									{radar.installationLocation}
								</h3>
							</div>

							<div className="shrink-0 w-12 h-12 rounded-full border-[3.5px] border-red-600 bg-white flex flex-col items-center justify-center shadow-md shadow-red-600/15 ring-2 ring-red-100/80 select-none p-0.5">
								<span
									className={`${speedInfo.textSize} font-black text-slate-900 leading-none tracking-tight text-center whitespace-nowrap px-0.5`}
								>
									{speedInfo.display}
								</span>
								{speedInfo.unit && (
									<span className="text-[6.5px] font-black text-red-600 uppercase tracking-tighter leading-none mt-0.5">
										{speedInfo.unit}
									</span>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/90 flex flex-col justify-between">
								<div className="flex items-center gap-1.5 text-[10px] text-blue-700/80 font-bold uppercase tracking-wider">
									<FiCompass size={11} className="text-blue-600" />
									<span>Sentido</span>
								</div>
								<p
									className="font-extrabold text-slate-900 text-xs truncate mt-1 flex items-center gap-1"
									title={radar.monitoringDirection}
								>
									<span className="text-blue-600 font-bold">➔</span>
									<span className="truncate">
										{radar.monitoringDirection || "Ambos os sentidos"}
									</span>
								</p>
							</div>

							<div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/90 flex flex-col justify-between">
								<div className="flex items-center gap-1.5 text-[10px] text-indigo-700/80 font-bold uppercase tracking-wider">
									<PiRoadHorizonBold size={11} className="text-indigo-600" />
									<span>Faixas</span>
								</div>
								<p className="font-extrabold text-slate-900 text-xs truncate mt-1">
									{radar.monitoredLanes}{" "}
									{radar.monitoredLanes === 1 ? "faixa ativa" : "faixas ativas"}
								</p>
							</div>

							<div className="bg-gradient-to-r from-amber-50/80 to-orange-50/60 p-2.5 rounded-xl border border-amber-200/70 col-span-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-[10px] text-amber-800 font-bold uppercase tracking-wider">
										<PiGaugeBold size={12} className="text-amber-600" />
										<span>Fluxo Médio Diário (VMD)</span>
									</div>
									{radar.vmdPeriod && (
										<span className="text-[9px] px-1.5 py-0.5 bg-amber-100/90 rounded-md text-amber-800 font-bold font-mono shrink-0 border border-amber-200">
											{radar.vmdPeriod}
										</span>
									)}
								</div>
								<p className="font-extrabold text-slate-900 text-xs mt-1 flex items-baseline gap-1.5">
									{radar.vmd > 0 ? (
										<>
											<span className="text-sm font-black text-amber-950 font-mono">
												{radar.vmd.toLocaleString("pt-BR")}
											</span>
											<span className="text-[11px] text-amber-800/80 font-medium">
												veículos por dia
											</span>
										</>
									) : (
										<span className="text-slate-500 font-medium text-[11px]">
											Dado de fluxo não informado
										</span>
									)}
								</p>
							</div>
						</div>

						<div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
							{(radar.equipmentIdentification || radar.inmetroRegistration) && (
								<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9.5px] pb-1.5 border-b border-slate-200/60 font-medium text-slate-600">
									{radar.equipmentIdentification && (
										<span className="flex items-center gap-1">
											<span className="text-slate-400 uppercase font-bold">
												ID:
											</span>
											<strong className="text-slate-900 font-mono font-bold">
												{radar.equipmentIdentification}
											</strong>
										</span>
									)}
									{radar.inmetroRegistration && (
										<span className="flex items-center gap-1">
											<span className="text-slate-400 uppercase font-bold">
												INMETRO:
											</span>
											<strong className="text-slate-900 font-semibold truncate">
												{radar.inmetroRegistration}
											</strong>
										</span>
									)}
								</div>
							)}

							<div className="flex items-center justify-between text-[10.5px]">
								<div className="flex items-center gap-1.5 text-slate-600 font-medium min-w-0">
									<FiMapPin size={11} className="text-blue-600 shrink-0" />
									<span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
										GPS
									</span>
									<span className="text-slate-800 font-mono text-[10px] truncate">
										{formattedCoords}
									</span>
								</div>
								<button
									type="button"
									onClick={handleCopyCoords}
									className="text-blue-600 hover:text-blue-700 active:scale-95 font-bold flex items-center gap-1 transition-all cursor-pointer hover:bg-blue-50 px-2 py-0.5 rounded-md shrink-0 ml-2"
									title="Copiar coordenadas"
								>
									{copied ? (
										<>
											<FiCheck size={11} className="text-emerald-600" />
											<span className="text-emerald-600 text-[10px]">
												Copiado!
											</span>
										</>
									) : (
										<>
											<FiCopy size={10} />
											<span className="text-[10px]">Copiar</span>
										</>
									)}
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-700 hover:!to-indigo-700 active:scale-[0.98] !text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={13} className="!text-white shrink-0" />
								<span className="!text-white">Street View</span>
							</a>
							<a
								href={directionsUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2.5 px-3 !bg-slate-100 hover:!bg-slate-200 active:scale-[0.98] !text-slate-800 rounded-xl text-xs font-bold border border-slate-200/90 shadow-xs transition-all cursor-pointer text-center"
							>
								<FiNavigation size={13} className="text-blue-600 shrink-0" />
								<span className="!text-slate-800">Como Chegar</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
