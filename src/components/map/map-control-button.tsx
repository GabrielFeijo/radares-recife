"use client";

import type { ReactNode } from "react";

interface MapControlButtonProps {
	onClick: () => void;
	isActive?: boolean;
	icon: ReactNode;
	title: string;
	ariaLabel?: string;
	disabled?: boolean;
	className?: string;
}

export function MapControlButton({
	onClick,
	isActive = true,
	icon,
	title,
	ariaLabel,
	disabled = false,
	className = "",
}: MapControlButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel ?? title}
			title={title}
			className={`p-2.5 sm:p-3 border border-slate-200 bg-white text-slate-700 rounded-2xl shadow-md hover:shadow-lg hover:border-slate-300 hover:text-slate-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 relative group ${className}`}
		>
			<div className="relative flex items-center justify-center">
				{icon}
				{!isActive && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="w-full h-0.5 bg-rose-500 transform rotate-45 rounded-full shadow-xs" />
					</div>
				)}
			</div>
		</button>
	);
}
