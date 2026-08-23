"use client";

import type React from "react";
import { FiCompass } from "react-icons/fi";
import {
	PiGaugeBold,
	PiRoadHorizonBold,
	PiTrafficSignalFill,
} from "react-icons/pi";
import { Marker, Popup, Tooltip } from "react-leaflet";
import type { RadarData } from "@/types";
import { radarIcon } from "./map-icons";
import { PopupActions } from "./popup-actions";
import { PopupGpsRow } from "./popup-gps-row";
import { PopupHeader } from "./popup-header";

interface RadarMarkerProps {
	radar: RadarData;
	showLabel?: boolean;
}

interface SpeedBadgeInfo {
	display: string;
	unit: string;
	textSize: string;
}

function getSpeedBadgeInfo(speed?: string): SpeedBadgeInfo {
	if (!speed?.trim()) {
		return {
			display: "—",
			unit: "",
			textSize: "text-xs",
		};
	}

	const raw = speed.trim();
	const clean = raw
		.replace(/km\s*\/\s*h/gi, "")
		.replace(/kmh/gi, "")
		.trim();

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
		unit: "km/h",
		textSize,
	};
}

export const RadarMarker: React.FC<RadarMarkerProps> = ({
	radar,
	showLabel = false,
}) => {
	const speedInfo = getSpeedBadgeInfo(radar.monitoredSpeed);

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
				<div className="w-[305px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category={radar.equipmentType || "Radar de Trânsito"}
						variant="radar"
						icon={<PiTrafficSignalFill size={13} className="text-amber-600" />}
						badge="CTTU Recife"
					/>

					<div className="p-3.5 space-y-3">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-0.5">
									Local de Fiscalização
								</span>
								<h3 className="font-bold text-[13px] text-slate-900 leading-snug break-words">
									{radar.installationLocation}
								</h3>
							</div>

							<div
								className="shrink-0 w-11 h-11 rounded-full border-[3px] border-red-600 bg-white flex flex-col items-center justify-center shadow-xs select-none"
								title={`Velocidade máxima permitida: ${radar.monitoredSpeed}`}
							>
								<span
									className={`${speedInfo.textSize} font-black text-slate-900 leading-none tracking-tight text-center px-0.5`}
								>
									{speedInfo.display}
								</span>
								{speedInfo.unit && (
									<span className="text-[6.5px] font-bold text-red-600 uppercase tracking-tight leading-none mt-0.5">
										{speedInfo.unit}
									</span>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
								<div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
									<FiCompass size={11} className="text-slate-400" />
									<span>Sentido</span>
								</div>
								<p
									className="font-semibold text-slate-800 text-xs truncate mt-1"
									title={radar.monitoringDirection}
								>
									{radar.monitoringDirection || "Ambos os sentidos"}
								</p>
							</div>

							<div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
								<div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
									<PiRoadHorizonBold size={11} className="text-slate-400" />
									<span>Faixas</span>
								</div>
								<p className="font-semibold text-slate-800 text-xs truncate mt-1">
									{radar.monitoredLanes}{" "}
									{radar.monitoredLanes === 1 ? "faixa ativa" : "faixas ativas"}
								</p>
							</div>

							<div className="col-span-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
								<div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
									<div className="flex items-center gap-1.5">
										<PiGaugeBold size={11} className="text-slate-400" />
										<span>Fluxo Médio Diário (VMD)</span>
									</div>
									{radar.vmdPeriod && (
										<span className="text-[9px] px-1.5 py-0.2 bg-white rounded text-slate-600 font-mono font-medium border border-slate-200">
											{radar.vmdPeriod}
										</span>
									)}
								</div>
								<p className="font-semibold text-slate-800 text-xs mt-1">
									{radar.vmd > 0 ? (
										<span className="flex items-baseline gap-1.5">
											<strong className="text-sm font-bold text-slate-900 font-mono">
												{radar.vmd.toLocaleString("pt-BR")}
											</strong>
											<span className="text-slate-500 text-[11px] font-normal">
												veículos por dia
											</span>
										</span>
									) : (
										<span className="text-slate-400 font-normal text-[11px]">
											Dado de fluxo não informado
										</span>
									)}
								</p>
							</div>
						</div>

						{(radar.equipmentIdentification || radar.inmetroRegistration) && (
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-[10px] text-slate-500">
								{radar.equipmentIdentification && (
									<span>
										<span className="text-slate-400 font-medium">ID:</span>{" "}
										<strong className="font-mono text-slate-700">
											{radar.equipmentIdentification}
										</strong>
									</span>
								)}
								{radar.inmetroRegistration && (
									<span className="truncate">
										<span className="text-slate-400 font-medium">INMETRO:</span>{" "}
										<strong className="text-slate-700">
											{radar.inmetroRegistration}
										</strong>
									</span>
								)}
							</div>
						)}

						<PopupGpsRow
							latitude={radar.latitude}
							longitude={radar.longitude}
						/>

						<PopupActions
							latitude={radar.latitude}
							longitude={radar.longitude}
						/>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
