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
			className={`p-2.5 sm:px-3 sm:py-2.5 border border-slate-200/80 bg-white/95 backdrop-blur-md text-slate-800 rounded-xl shadow-md hover:shadow-lg hover:bg-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
		>
			<div className="relative flex items-center justify-center">
				{icon}
				{!isActive && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="w-full h-0.5 bg-red-500 transform rotate-45 rounded-full shadow-sm" />
					</div>
				)}
			</div>
		</button>
	);
}
