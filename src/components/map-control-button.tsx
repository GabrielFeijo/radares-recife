import React, { ReactNode } from 'react';

interface MapControlButtonProps {
    onClick: () => void;
    isActive: boolean;
    icon: ReactNode;
    title: string;
}

export const MapControlButton: React.FC<MapControlButtonProps> = ({
    onClick,
    isActive,
    icon,
    title
}) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 border border-gray-300 bg-white bg-opacity-90 text-gray-800 rounded shadow-lg hover:bg-gray-50 transition-colors duration-300"
            title={title}
        >
            <div className="relative">
                {icon}
                {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                    </div>
                )}
            </div>
        </button>
    );
};
