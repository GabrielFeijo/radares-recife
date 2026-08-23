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
import {
	PiCertificateBold,
	PiGaugeBold,
	PiRoadHorizonBold,
	PiShieldCheckFill,
	PiTrafficSignalBold,
} from "react-icons/pi";
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

export const RadarMarker: React.FC<RadarMarkerProps> = ({
	radar,
	showLabel = false,
}) => {
	const { copied, copy } = useClipboard();
	const speedClean =
		radar.monitoredSpeed?.replace(/km\/h/i, "").trim() || "Radar";

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

			<Popup closeButton={false} autoClose className="!m-0">
				<div className="w-[310px] sm:w-[340px] text-slate-800 font-sans p-4 space-y-3">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 flex-wrap">
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50/90 text-amber-800 border border-amber-200/70 shadow-xs">
								<PiTrafficSignalBold
									size={14}
									className="text-amber-600 shrink-0"
								/>
								{radar.equipmentType || "Radar de Trânsito"}
							</span>
							<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-emerald-50/90 text-emerald-700 border border-emerald-200/60 shadow-xs">
								<PiShieldCheckFill size={12} className="shrink-0" />
								Ativo CTTU
							</span>
						</div>
					</div>

					<div className="flex items-start justify-between gap-3 pt-0.5 pb-2.5 border-b border-slate-100">
						<div className="flex-1 min-w-0">
							<span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
								Local de Instalação
							</span>
							<h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug break-words">
								{radar.installationLocation}
							</h3>
						</div>
						<div className="shrink-0 w-13 h-13 rounded-full border-[3.5px] border-red-600 bg-white flex flex-col items-center justify-center shadow-md shadow-red-500/10 ring-3 ring-red-50">
							<span className="text-base font-black text-slate-900 leading-none tracking-tight">
								{speedClean}
							</span>
							<span className="text-[7.5px] font-black text-red-600 uppercase tracking-tighter mt-0.5">
								KM/H
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2 text-xs">
						<div className="bg-slate-50/90 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 space-y-1 transition-colors">
							<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
								<FiCompass size={13} className="text-slate-400 shrink-0" />
								Sentido
							</span>
							<p
								className="font-semibold text-slate-800 text-[11px] leading-tight truncate"
								title={radar.monitoringDirection}
							>
								{radar.monitoringDirection || "Ambos os sentidos"}
							</p>
						</div>

						<div className="bg-slate-50/90 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 space-y-1 transition-colors">
							<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
								<PiRoadHorizonBold
									size={14}
									className="text-slate-400 shrink-0"
								/>
								Faixas
							</span>
							<p className="font-semibold text-slate-800 text-[11px] leading-tight truncate">
								{radar.monitoredLanes}{" "}
								{radar.monitoredLanes === 1 ? "faixa" : "faixas"}
							</p>
						</div>

						<div className="bg-slate-50/90 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100/90 col-span-2 space-y-1 transition-colors">
							<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
								<PiGaugeBold size={14} className="text-slate-400 shrink-0" />
								Fluxo Médio Diário (VMD)
							</span>
							<div className="flex items-center justify-between gap-2">
								<p className="font-semibold text-slate-800 text-xs">
									{radar.vmd > 0
										? `${radar.vmd.toLocaleString("pt-BR")} veículos/dia`
										: "Não informado"}
								</p>
								{radar.vmdPeriod && (
									<span className="text-[9.5px] px-2 py-0.5 bg-slate-200/80 rounded-md text-slate-600 font-medium shrink-0">
										{radar.vmdPeriod}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between bg-slate-50/90 px-3 py-2 rounded-xl border border-slate-100 text-[11px]">
						<span className="text-slate-500 flex items-center gap-1.5">
							<FiMapPin size={13} className="text-slate-400 shrink-0" />
							GPS:{" "}
							<strong className="text-slate-700 font-mono text-[11px]">
								{formattedCoords}
							</strong>
						</span>
						<button
							type="button"
							onClick={handleCopyCoords}
							className="text-blue-600 hover:text-blue-700 active:scale-95 font-medium flex items-center gap-1 transition-all cursor-pointer select-none"
							title="Copiar coordenadas"
						>
							{copied ? (
								<>
									<FiCheck size={13} className="text-emerald-600" />
									<span className="text-emerald-600 font-semibold text-[10px]">
										Copiado!
									</span>
								</>
							) : (
								<>
									<FiCopy size={13} />
									<span className="text-[10px]">Copiar</span>
								</>
							)}
						</button>
					</div>

					{(radar.equipmentIdentification || radar.inmetroRegistration) && (
						<div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/80 text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
							<span className="flex items-center gap-1 text-amber-900 font-medium">
								<PiCertificateBold size={13} className="text-amber-600" />
								Metadados:
							</span>
							{radar.equipmentIdentification && (
								<span>
									ID:{" "}
									<strong className="text-slate-800">
										{radar.equipmentIdentification}
									</strong>
								</span>
							)}
							{radar.inmetroRegistration && (
								<span>
									INMETRO:{" "}
									<strong className="text-slate-800">
										{radar.inmetroRegistration}
									</strong>
								</span>
							)}
						</div>
					)}

					<div className="grid grid-cols-2 gap-2 pt-1">
						<a
							href={streetViewUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all duration-150 cursor-pointer text-center"
						>
							<FiExternalLink size={13} className="shrink-0" />
							<span>Street View</span>
						</a>
						<a
							href={directionsUrl}
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/90 active:scale-[0.98] text-slate-800 rounded-xl text-xs font-semibold border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer text-center"
						>
							<FiNavigation size={13} className="text-blue-600 shrink-0" />
							<span>Como Chegar</span>
						</a>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
