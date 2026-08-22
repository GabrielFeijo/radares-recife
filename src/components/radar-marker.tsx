import L from "leaflet";
import type React from "react";
import { FiCompass, FiExternalLink } from "react-icons/fi";
import {
	PiGaugeBold,
	PiRoadHorizonBold,
	PiTrafficSignalBold,
} from "react-icons/pi";
import { Marker, Popup, Tooltip } from "react-leaflet";
import type { RadarData } from "@/types";

const radarIcon = new L.Icon({
	iconUrl: "/radar.png",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16],
});

interface RadarMarkerProps {
	radar: RadarData;
	isActive: boolean;
	onClick: () => void;
}

export const RadarMarker: React.FC<RadarMarkerProps> = ({
	radar,
	isActive,
	onClick,
}) => {
	const speedClean =
		radar.monitoredSpeed?.replace(/km\/h/i, "").trim() || "Radar";

	return (
		<Marker
			position={[radar.latitude, radar.longitude]}
			title={radar.installationLocation}
			icon={radarIcon}
			eventHandlers={{
				mousedown: onClick,
			}}
		>
			<Tooltip offset={[16, 0]} opacity={0.95} permanent className="font-bold">
				{radar.monitoredSpeed}
			</Tooltip>
			{isActive && (
				<Popup autoClose>
					<div className="w-72 sm:w-80 text-slate-800 font-sans p-4 space-y-3">
						{/* Header do Card */}
						<div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
							<div className="space-y-1">
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
									<PiTrafficSignalBold size={13} />
									{radar.equipmentType || "Radar de Trânsito"}
								</span>
								<h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
									{radar.installationLocation}
								</h3>
							</div>
							{/* Placa de Velocidade estilo trânsito */}
							<div className="shrink-0 w-11 h-11 rounded-full border-[3px] border-red-600 bg-white flex flex-col items-center justify-center shadow-sm">
								<span className="text-[13px] font-black text-slate-900 leading-none">
									{speedClean}
								</span>
								<span className="text-[7px] font-bold text-red-600 uppercase tracking-tighter">
									KM/H
								</span>
							</div>
						</div>

						{/* Grid de Detalhes */}
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-0.5">
									<FiCompass size={11} className="text-slate-400" /> Sentido
								</span>
								<p
									className="font-semibold text-slate-800 truncate"
									title={radar.monitoringDirection}
								>
									{radar.monitoringDirection || "Ambos"}
								</p>
							</div>

							<div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-0.5">
									<PiRoadHorizonBold size={11} className="text-slate-400" />{" "}
									Faixas
								</span>
								<p className="font-semibold text-slate-800">
									{radar.monitoredLanes}{" "}
									{radar.monitoredLanes === 1 ? "faixa" : "faixas"}
								</p>
							</div>

							<div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 col-span-2">
								<span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mb-0.5">
									<PiGaugeBold size={11} className="text-slate-400" /> Volume
									Médio Diário (VMD)
								</span>
								<p className="font-semibold text-slate-800">
									{radar.vmd > 0
										? `${radar.vmd.toLocaleString("pt-BR")} veículos/dia`
										: "Não informado"}
									{radar.vmdPeriod && (
										<span className="text-[10px] text-slate-500 font-normal ml-1">
											({radar.vmdPeriod})
										</span>
									)}
								</p>
							</div>
						</div>

						{/* Metadados Técnicos / INMETRO */}
						{(radar.equipmentIdentification || radar.inmetroRegistration) && (
							<div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 pt-0.5">
								{radar.equipmentIdentification && (
									<span>
										ID:{" "}
										<strong className="text-slate-700">
											{radar.equipmentIdentification}
										</strong>
									</span>
								)}
								{radar.inmetroRegistration && (
									<span>
										INMETRO:{" "}
										<strong className="text-slate-700">
											{radar.inmetroRegistration}
										</strong>
									</span>
								)}
							</div>
						)}

						{/* Botão de Ação: Google Street View */}
						<a
							href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${radar.latitude},${radar.longitude}`}
							target="_blank"
							rel="noreferrer"
							className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow cursor-pointer"
						>
							<span>Abrir no Google Street View</span>
							<FiExternalLink size={13} />
						</a>
					</div>
				</Popup>
			)}
		</Marker>
	);
};
