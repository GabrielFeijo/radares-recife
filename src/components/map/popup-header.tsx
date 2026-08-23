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

const VARIANT_STYLES: Record<
	PopupCategoryVariant,
	{ badgeBg: string; badgeText: string; badgeBorder: string }
> = {
	radar: {
		badgeBg: "bg-amber-50",
		badgeText: "text-amber-800",
		badgeBorder: "border-amber-200/80",
	},
	camera: {
		badgeBg: "bg-sky-50",
		badgeText: "text-sky-800",
		badgeBorder: "border-sky-200/80",
	},
	search: {
		badgeBg: "bg-indigo-50",
		badgeText: "text-indigo-800",
		badgeBorder: "border-indigo-200/80",
	},
	location: {
		badgeBg: "bg-emerald-50",
		badgeText: "text-emerald-800",
		badgeBorder: "border-emerald-200/80",
	},
	neutral: {
		badgeBg: "bg-slate-100",
		badgeText: "text-slate-700",
		badgeBorder: "border-slate-200",
	},
};

export function PopupHeader({
	category,
	variant = "neutral",
	badge,
	icon,
}: PopupHeaderProps) {
	const styles = VARIANT_STYLES[variant];

	return (
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2 border-b border-slate-100">
			<div
				className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10.5px] font-semibold tracking-wide uppercase ${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder}`}
			>
				{icon && <span className="shrink-0">{icon}</span>}
				<span className="truncate">{category}</span>
			</div>

			{badge && (
				<div className="text-[10px] font-medium text-slate-500 shrink-0">
					{badge}
				</div>
			)}
		</div>
	);
}
