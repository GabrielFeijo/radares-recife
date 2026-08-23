import { FiExternalLink, FiNavigation } from "react-icons/fi";
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
				className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold !text-white !bg-slate-900 hover:!bg-slate-800 active:scale-[0.98] transition-all text-center shadow-xs"
			>
				<FiExternalLink size={12} className="!text-white shrink-0" />
				<span className="!text-white">{primaryLabel}</span>
			</a>

			{showDirections && (
				<a
					href={directionsUrl}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold !text-slate-700 !bg-white border border-slate-200 hover:!bg-slate-50 hover:!text-slate-900 active:scale-[0.98] transition-all text-center"
				>
					<FiNavigation size={12} className="text-slate-500 shrink-0" />
					<span className="!text-slate-700">Como Chegar</span>
				</a>
			)}
		</div>
	);
}
