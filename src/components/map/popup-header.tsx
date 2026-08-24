import type React from "react";

export type PopupCategoryVariant =
	| "radar"
	| "camera"
	| "search"
	| "location"
	| "neutral";

interface PopupHeaderProps {
	category: string;
	variant?: PopupCategoryVariant;
	badge?: React.ReactNode;
	icon?: React.ReactNode;
}

const VARIANT_CONFIG: Record<
	PopupCategoryVariant,
	{ dotColor: string; badgeBorder: string; badgeBg: string; badgeText: string }
> = {
	radar: {
		dotColor: "bg-amber-500",
		badgeBorder: "border-amber-200/60",
		badgeBg: "bg-amber-50/60",
		badgeText: "text-amber-800",
	},
	camera: {
		dotColor: "bg-sky-500",
		badgeBorder: "border-sky-200/60",
		badgeBg: "bg-sky-50/60",
		badgeText: "text-sky-800",
	},
	search: {
		dotColor: "bg-indigo-500",
		badgeBorder: "border-indigo-200/60",
		badgeBg: "bg-indigo-50/60",
		badgeText: "text-indigo-800",
	},
	location: {
		dotColor: "bg-emerald-500",
		badgeBorder: "border-emerald-200/60",
		badgeBg: "bg-emerald-50/60",
		badgeText: "text-emerald-800",
	},
	neutral: {
		dotColor: "bg-slate-400",
		badgeBorder: "border-slate-200/60",
		badgeBg: "bg-slate-50",
		badgeText: "text-slate-700",
	},
};

export function PopupHeader({
	category,
	variant = "neutral",
	badge,
	icon,
}: PopupHeaderProps) {
	const config = VARIANT_CONFIG[variant];

	return (
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5 border-b border-slate-100">
			<div className="flex items-center gap-2 min-w-0">
				<span className="relative flex h-2 w-2 shrink-0">
					<span
						className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotColor} opacity-40`}
					/>
					<span
						className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}
					/>
				</span>
				<div className="flex items-center gap-1.5 min-w-0">
					{icon && <span className="shrink-0 text-slate-400">{icon}</span>}
					<span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
						{category}
					</span>
				</div>
			</div>

			{badge && (
				<div className="text-[10px] font-mono font-medium text-slate-500 shrink-0 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-150">
					{badge}
				</div>
			)}
		</div>
	);
}
