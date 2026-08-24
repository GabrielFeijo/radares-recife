import { FiArrowUpRight, FiCompass } from "react-icons/fi";
import { getDirectionsUrl, getStreetViewUrl } from "@/utils/maps";

interface PopupActionsProps {
	latitude: number;
	longitude: number;
	showDirections?: boolean;
	primaryLabel?: string;
}

export function PopupActions({
	latitude,
	longitude,
	showDirections = true,
	primaryLabel = "Street View",
}: PopupActionsProps) {
	const streetViewUrl = getStreetViewUrl(latitude, longitude);
	const directionsUrl = getDirectionsUrl(latitude, longitude);

	return (
		<div
			className={`grid gap-2 pt-1 ${
				showDirections ? "grid-cols-2" : "grid-cols-1"
			}`}
		>
			<a
				href={streetViewUrl}
				target="_blank"
				rel="noreferrer"
				className="group inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold !text-white !bg-slate-900 hover:!bg-slate-800 active:scale-[0.98] transition-all text-center shadow-xs"
			>
				<span className="!text-white font-medium">{primaryLabel}</span>
				<FiArrowUpRight
					size={13}
					className="!text-slate-400 group-hover:!text-white transition-colors shrink-0"
				/>
			</a>

			{showDirections && (
				<a
					href={directionsUrl}
					target="_blank"
					rel="noreferrer"
					className="group inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold !text-slate-700 !bg-white border border-slate-200 hover:!bg-slate-50 hover:!text-slate-950 hover:border-slate-300 active:scale-[0.98] transition-all text-center"
				>
					<FiCompass
						size={13}
						className="text-slate-400 group-hover:text-slate-700 transition-colors shrink-0"
					/>
					<span className="!text-slate-700 group-hover:!text-slate-950 font-medium">
						Como Chegar
					</span>
				</a>
			)}
		</div>
	);
}
