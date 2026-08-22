import type React from "react";

export const MapSkeleton: React.FC = () => {
	return (
		<div className="relative w-full h-full min-h-screen bg-slate-100 overflow-hidden select-none animate-pulse">
			{/* Simulação de malha cartográfica / rios e vias do Recife */}
			<svg
				className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<defs>
					<pattern
						id="grid-pattern"
						width="60"
						height="60"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 60 0 L 0 0 0 60"
							fill="none"
							stroke="#cbd5e1"
							strokeWidth="1"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#grid-pattern)" />
				{/* Simulação do Rio Capibaribe / Rios cortando o mapa */}
				<path
					d="M -50 200 Q 250 180 400 350 T 800 450 T 1400 300 T 2000 600"
					fill="none"
					stroke="#93c5fd"
					strokeWidth="32"
					strokeLinecap="round"
				/>
				<path
					d="M 300 0 Q 380 200 400 350 T 500 700 T 600 1200"
					fill="none"
					stroke="#93c5fd"
					strokeWidth="20"
					strokeLinecap="round"
				/>
				{/* Simulação de grandes avenidas */}
				<path
					d="M 0 120 L 2000 500"
					fill="none"
					stroke="#e2e8f0"
					strokeWidth="12"
				/>
				<path
					d="M 500 0 L 600 1200"
					fill="none"
					stroke="#e2e8f0"
					strokeWidth="14"
				/>
				<path
					d="M 100 0 L 900 1200"
					fill="none"
					stroke="#e2e8f0"
					strokeWidth="10"
				/>
			</svg>

			{/* Simulação de marcadores de radares e câmeras espalhados */}
			<div className="absolute top-[28%] left-[22%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-amber-500" />
				</div>
				<div className="h-5 w-8 rounded bg-white/90 shadow-sm border border-gray-200" />
			</div>

			<div className="absolute top-[42%] left-[48%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-amber-500" />
				</div>
				<div className="h-5 w-8 rounded bg-white/90 shadow-sm border border-gray-200" />
			</div>

			<div className="absolute top-[58%] left-[35%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-blue-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-blue-500" />
				</div>
			</div>

			<div className="absolute top-[35%] left-[68%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-amber-500" />
				</div>
				<div className="h-5 w-8 rounded bg-white/90 shadow-sm border border-gray-200" />
			</div>

			<div className="absolute top-[65%] left-[62%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-blue-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-blue-500" />
				</div>
			</div>

			<div className="absolute top-[20%] left-[55%] flex items-center gap-1.5 opacity-60">
				<div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-white shadow-sm flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-amber-500" />
				</div>
				<div className="h-5 w-8 rounded bg-white/90 shadow-sm border border-gray-200" />
			</div>

			{/* Skeleton: Barra de Busca no Topo */}
			<div className="absolute top-3 left-3 right-3 sm:right-auto z-10 sm:w-80 md:w-96">
				<div className="w-full h-11 sm:h-12 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 flex items-center justify-between px-4">
					<div className="h-4 w-48 bg-gray-200 rounded" />
					<div className="w-5 h-5 bg-gray-300 rounded-full" />
				</div>
			</div>

			{/* Skeleton: Botões de Controle no Topo Direito */}
			<div className="absolute top-16 sm:top-3 right-3 z-10 flex flex-wrap items-center gap-2">
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
					<div className="w-5 h-5 bg-amber-200 rounded" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
					<div className="w-5 h-5 bg-blue-200 rounded" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
					<div className="w-5 h-5 bg-gray-200 rounded" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
					<div className="w-5 h-5 bg-gray-200 rounded" />
				</div>
			</div>

			{/* Skeleton: Painel Informativo Inferior Esquerdo */}
			<div className="absolute bottom-4 left-3 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200 min-w-56 space-y-2">
				<div className="flex items-center gap-2">
					<div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
					<div className="h-4 w-20 bg-gray-200 rounded" />
					<span className="text-gray-300">|</span>
					<div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
					<div className="h-4 w-20 bg-gray-200 rounded" />
				</div>
				<div className="h-3 w-40 bg-gray-200 rounded" />
			</div>

			{/* Skeleton: Controles de Zoom no Canto Inferior Direito */}
			<div className="absolute bottom-6 right-3 z-10 hidden sm:flex flex-col rounded-md shadow-md border border-gray-300 overflow-hidden bg-white">
				<div className="w-8 h-8 flex items-center justify-center border-b border-gray-200 text-gray-400 font-bold text-lg">
					+
				</div>
				<div className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-lg">
					-
				</div>
			</div>
		</div>
	);
};

export default MapSkeleton;
