"use client";

import { FiCrosshair, FiFilter } from "react-icons/fi";
import {
	PiSecurityCameraFill,
	PiTagBold,
	PiTrafficSignalFill,
} from "react-icons/pi";
import type { MapControlsState } from "@/hooks/use-map-controls";
import { MapControlButton } from "./map-control-button";

interface MapControlsProps {
	controls: MapControlsState;
	isLocating: boolean;
	onLocate: () => void;
}

export function MapControls({
	controls,
	isLocating,
	onLocate,
}: MapControlsProps) {
	return (
		<div className="absolute top-[max(4.25rem,calc(env(safe-area-inset-top)+3.5rem))] sm:top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-map-ui flex flex-wrap items-center gap-1.5 sm:gap-2">
			<MapControlButton
				onClick={controls.toggleRadars}
				isActive={controls.showRadars}
				icon={
					<PiTrafficSignalFill
						size={20}
						className={
							controls.showRadars ? "text-amber-500" : "text-slate-400"
						}
					/>
				}
				title={controls.showRadars ? "Ocultar Radares" : "Exibir Radares"}
				ariaLabel="Alternar visibilidade de radares"
			/>

			<MapControlButton
				onClick={controls.toggleCameras}
				isActive={controls.showCameras}
				icon={
					<PiSecurityCameraFill
						size={20}
						className={controls.showCameras ? "text-sky-600" : "text-slate-400"}
					/>
				}
				title={controls.showCameras ? "Ocultar Câmeras" : "Exibir Câmeras"}
				ariaLabel="Alternar visibilidade de câmeras"
			/>

			<MapControlButton
				onClick={controls.toggleSpeedLabels}
				isActive={controls.showSpeedLabels}
				icon={
					<PiTagBold
						size={18}
						className={
							controls.showSpeedLabels ? "text-indigo-600" : "text-slate-400"
						}
					/>
				}
				title={
					controls.showSpeedLabels
						? "Ocultar Etiquetas de Velocidade"
						: "Exibir Etiquetas de Velocidade"
				}
				ariaLabel="Alternar rótulos fixos de velocidade"
			/>

			<MapControlButton
				onClick={controls.toggleSpeedFilter}
				isActive={controls.showSpeedFilter || controls.selectedSpeed !== "all"}
				icon={
					<FiFilter
						size={18}
						className={
							controls.selectedSpeed !== "all"
								? "text-emerald-600 font-bold"
								: "text-slate-500 group-hover:text-slate-800"
						}
					/>
				}
				title="Filtrar por velocidade"
				ariaLabel="Filtrar por velocidade dos radares"
			/>

			<MapControlButton
				onClick={onLocate}
				disabled={isLocating}
				icon={
					<FiCrosshair
						size={18}
						className={
							isLocating
								? "animate-spin text-blue-600"
								: "text-slate-500 group-hover:text-slate-800"
						}
					/>
				}
				title="Minha Localização"
				ariaLabel="Centralizar mapa na minha localização atual"
			/>
		</div>
	);
}
