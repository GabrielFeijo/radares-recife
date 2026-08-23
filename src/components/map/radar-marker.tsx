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

			<Popup
				closeButton={false}
				autoClose
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
				className="!m-0"
			>
				<div className="w-[300px] sm:w-[320px] text-slate-800 font-sans overflow-hidden rounded-2xl">
					<div className="bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 min-w-0">
							<div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
								<PiTrafficSignalBold size={14} />
							</div>
							<span className="text-xs font-semibold tracking-wide truncate">
								{radar.equipmentType || "Radar de Trânsito"}
							</span>
						</div>
						<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
							CTTU
						</span>
					</div>

					<div className="p-3.5 space-y-3 bg-white">
						<div className="flex items-start justify-between gap-3 pb-1 border-b border-slate-100">
							<div className="flex-1 min-w-0">
								<span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 tracking-wider">
									Localização
								</span>
								<h3 className="font-bold text-sm text-slate-900 leading-snug break-words">
									{radar.installationLocation}
								</h3>
							</div>
							<div className="shrink-0 w-11 h-11 rounded-full border-[3px] border-red-600 bg-white flex flex-col items-center justify-center shadow-xs">
								<span className="text-sm font-black text-slate-900 leading-none">
									{speedClean}
								</span>
								<span className="text-[6.5px] font-black text-red-600 uppercase tracking-tighter">
									KM/H
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
									<FiCompass size={11} className="text-slate-400 shrink-0" />
									Sentido
								</span>
								<p
									className="font-bold text-slate-800 text-[11px] truncate mt-0.5"
									title={radar.monitoringDirection}
								>
									{radar.monitoringDirection || "Ambos os sentidos"}
								</p>
							</div>

							<div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
									<PiRoadHorizonBold
										size={12}
										className="text-slate-400 shrink-0"
									/>
									Faixas
								</span>
								<p className="font-bold text-slate-800 text-[11px] truncate mt-0.5">
									{radar.monitoredLanes}{" "}
									{radar.monitoredLanes === 1 ? "faixa" : "faixas"}
								</p>
							</div>

							<div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 col-span-2">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
									<PiGaugeBold size={12} className="text-slate-400 shrink-0" />
									Fluxo Médio Diário (VMD)
								</span>
								<div className="flex items-center justify-between gap-2 mt-0.5">
									<p className="font-bold text-slate-800 text-xs">
										{radar.vmd > 0
											? `${radar.vmd.toLocaleString("pt-BR")} veículos/dia`
											: "Não informado"}
									</p>
									{radar.vmdPeriod && (
										<span className="text-[9px] px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-semibold shrink-0">
											{radar.vmdPeriod}
										</span>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 text-[11px]">
							<span className="text-slate-600 flex items-center gap-1 font-medium">
								<FiMapPin size={11} className="text-slate-400 shrink-0" />
								GPS:{" "}
								<strong className="text-slate-800 font-mono text-[10px]">
									{formattedCoords}
								</strong>
							</span>
							<button
								type="button"
								onClick={handleCopyCoords}
								className="text-blue-600 hover:text-blue-700 active:scale-95 font-semibold flex items-center gap-1 transition-all cursor-pointer"
								title="Copiar coordenadas"
							>
								{copied ? (
									<>
										<FiCheck size={12} className="text-emerald-600" />
										<span className="text-emerald-600 text-[10px]">
											Copiado!
										</span>
									</>
								) : (
									<>
										<FiCopy size={11} />
										<span className="text-[10px]">Copiar</span>
									</>
								)}
							</button>
						</div>

						{(radar.equipmentIdentification || radar.inmetroRegistration) && (
							<div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 text-[10px] text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-0.5">
								<span className="flex items-center gap-1 text-amber-900 font-bold">
									<PiCertificateBold size={12} className="text-amber-600" />
									Metadados:
								</span>
								{radar.equipmentIdentification && (
									<span>
										ID:{" "}
										<strong className="text-slate-900">
											{radar.equipmentIdentification}
										</strong>
									</span>
								)}
								{radar.inmetroRegistration && (
									<span>
										INMETRO:{" "}
										<strong className="text-slate-900">
											{radar.inmetroRegistration}
										</strong>
									</span>
								)}
							</div>
						)}

						<div className="grid grid-cols-2 gap-2 pt-0.5">
							<a
								href={streetViewUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2 px-3 !bg-blue-600 hover:!bg-blue-700 active:scale-[0.98] !text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer text-center"
							>
								<FiExternalLink size={12} className="!text-white shrink-0" />
								<span className="!text-white">Street View</span>
							</a>
							<a
								href={directionsUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center justify-center gap-1.5 py-2 px-3 !bg-slate-100 hover:!bg-slate-200 active:scale-[0.98] !text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs transition-all cursor-pointer text-center"
							>
								<FiNavigation size={12} className="text-blue-600 shrink-0" />
								<span className="!text-slate-800">Como Chegar</span>
							</a>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
