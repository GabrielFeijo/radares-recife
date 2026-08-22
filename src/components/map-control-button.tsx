import type React from "react";
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

export const MapControlButton: React.FC<MapControlButtonProps> = ({
	onClick,
	isActive = true,
	icon,
	title,
	ariaLabel,
	disabled = false,
	className = "",
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel || title}
			className={`p-2.5 sm:px-3 sm:py-2 border border-gray-200 bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
			title={title}
		>
			<div className="relative flex items-center justify-center">
				{icon}
				{!isActive && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="w-full h-0.5 bg-red-500 transform rotate-45 rounded-full" />
					</div>
				)}
			</div>
		</button>
	);
};
