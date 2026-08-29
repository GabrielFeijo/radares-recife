"use client";

import type React from "react";
import { useMemo } from "react";
import { FiCompass } from "react-icons/fi";
import { Marker, Popup } from "react-leaflet";
import type { RadarData } from "@/types";
import { getSpeedBadgeInfo } from "@/utils/speed";
import { getRadarDivIcon } from "./map-icons";
import { PopupActions } from "./popup-actions";
import { PopupGpsRow } from "./popup-gps-row";
import { PopupHeader } from "./popup-header";

interface RadarMarkerProps {
	radar: RadarData;
	showLabel?: boolean;
}

export const RadarMarker: React.FC<RadarMarkerProps> = ({
	radar,
	showLabel = false,
}) => {
	const speedInfo = getSpeedBadgeInfo(radar.monitoredSpeed);

	const icon = useMemo(
		() => getRadarDivIcon(radar.monitoredSpeed, showLabel),
		[radar.monitoredSpeed, showLabel],
	);

	return (
		<Marker
			position={[radar.latitude, radar.longitude]}
			title={`${radar.installationLocation} (${radar.monitoredSpeed})`}
			icon={icon}
		>
			<Popup
				closeButton={false}
				autoClose
				autoPanPaddingTopLeft={[20, 90]}
				autoPanPaddingBottomRight={[20, 60]}
			>
				<div className="w-[305px] font-sans text-slate-800 bg-white">
					<PopupHeader
						category={radar.equipmentType || "Fiscalização Eletrônica"}
						variant="radar"
						badge={
							radar.equipmentIdentification
								? `#${radar.equipmentIdentification}`
								: "CTTU"
						}
					/>

					<div className="p-3.5 space-y-3">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-[13.5px] text-slate-900 leading-snug break-words">
									{radar.installationLocation}
								</h3>
								<div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
									<FiCompass size={11} className="text-slate-400 shrink-0" />
									<span className="truncate">
										{radar.monitoringDirection || "Ambos os sentidos"}
									</span>
								</div>
							</div>

							<div
								className="shrink-0 w-11 h-11 rounded-full border-[2.5px] border-red-600 bg-white flex flex-col items-center justify-center shadow-xs select-none"
								title={`Velocidade máxima permitida: ${radar.monitoredSpeed}`}
							>
								<span
									className={`${speedInfo.textSize} font-black text-slate-900 leading-none tracking-tight text-center px-0.5`}
								>
									{speedInfo.value}
								</span>
								{speedInfo.unit && (
									<span className="text-[6.5px] font-bold text-red-600 uppercase tracking-tight leading-none mt-0.5">
										{speedInfo.unit}
									</span>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
							<div>
								<span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
									Faixas
								</span>
								<p className="font-semibold text-slate-800 text-[12px] mt-0.5 font-mono">
									{radar.monitoredLanes}{" "}
									{radar.monitoredLanes === 1 ? "ativa" : "ativas"}
								</p>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
										Fluxo Diário
									</span>
									{radar.vmdPeriod && (
										<span className="text-[8.5px] font-mono text-slate-400">
											{radar.vmdPeriod}
										</span>
									)}
								</div>
								<p className="font-semibold text-slate-800 text-[12px] mt-0.5 font-mono">
									{radar.vmd > 0 ? (
										<span>
											{radar.vmd.toLocaleString("pt-BR")}{" "}
											<span className="text-[10px] text-slate-400 font-sans font-normal">
												veíc/dia
											</span>
										</span>
									) : (
										<span className="text-slate-400 font-normal text-[11px] font-sans">
											Não informado
										</span>
									)}
								</p>
							</div>
						</div>

						{(radar.inmetroRegistration || radar.manufacturerSerialNumber) && (
							<div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
								{radar.inmetroRegistration && (
									<span>INMETRO: {radar.inmetroRegistration}</span>
								)}
								{radar.manufacturerSerialNumber && (
									<span>SÉRIE: {radar.manufacturerSerialNumber}</span>
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
