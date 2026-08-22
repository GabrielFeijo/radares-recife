import type React from "react";
import { FiCrosshair, FiFilter, FiSearch } from "react-icons/fi";
import { PiSecurityCameraFill, PiTrafficSignalFill } from "react-icons/pi";

export const MapSkeleton: React.FC = () => {
	return (
		<div className="relative w-full h-full min-h-screen bg-[#e8ecef] overflow-hidden select-none">
			{/* Mapa Base Vetorial Estilizado (Cartografia Realista de Recife) */}
			<svg
				className="absolute inset-0 w-full h-full pointer-events-none"
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid slice"
				viewBox="0 0 1600 1000"
				aria-hidden="true"
			>
				{/* Fundo de Terra / Bairros */}
				<rect width="100%" height="100%" fill="#f2efe9" />

				{/* Áreas Verdes / Parques (ex: Parque da Jaqueira, Parque dos Manguinhos) */}
				<path
					d="M 250 150 Q 320 120 400 180 T 360 300 T 230 250 Z"
					fill="#dbe8d4"
					opacity="0.8"
				/>
				<path
					d="M 600 650 Q 750 600 850 720 T 700 880 T 550 800 Z"
					fill="#dbe8d4"
					opacity="0.8"
				/>
				<path
					d="M 1100 200 Q 1250 160 1350 260 T 1280 400 T 1080 320 Z"
					fill="#dbe8d4"
					opacity="0.8"
				/>

				{/* Rios do Recife e Oceano Atlântico */}
				{/* Oceano no Leste */}
				<path
					d="M 1450 0 C 1420 300 1440 650 1480 1000 L 1600 1000 L 1600 0 Z"
					fill="#aad3df"
				/>
				{/* Bacia do Pina e Rios Capibaribe / Beberibe */}
				<path
					d="M 0 350 Q 300 320 550 420 T 900 500 T 1200 480 Q 1380 470 1450 480"
					fill="none"
					stroke="#aad3df"
					strokeWidth="48"
					strokeLinecap="round"
				/>
				<path
					d="M 500 0 Q 530 180 600 300 T 750 460 T 880 750 Q 950 900 1000 1000"
					fill="none"
					stroke="#aad3df"
					strokeWidth="28"
					strokeLinecap="round"
				/>
				<path
					d="M 900 500 Q 1050 620 1200 700 T 1460 780"
					fill="none"
					stroke="#aad3df"
					strokeWidth="36"
					strokeLinecap="round"
				/>

				{/* Malha Viária Secundária */}
				<g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9">
					<line x1="0" y1="120" x2="1600" y2="120" />
					<line x1="0" y1="240" x2="1600" y2="280" />
					<line x1="0" y1="600" x2="1600" y2="580" />
					<line x1="0" y1="820" x2="1600" y2="850" />
					<line x1="180" y1="0" x2="220" y2="1000" />
					<line x1="420" y1="0" x2="480" y2="1000" />
					<line x1="720" y1="0" x2="700" y2="1000" />
					<line x1="1020" y1="0" x2="1080" y2="1000" />
					<line x1="1300" y1="0" x2="1340" y2="1000" />
				</g>

				{/* Avenidas Principais (Agamenon Magalhães, Av. Boa Viagem, Av. Caxangá, Av. Recife, Av. Norte) */}
				<g
					stroke="#fecd7a"
					strokeWidth="8"
					strokeLinecap="round"
					opacity="0.95"
				>
					<path d="M 0 450 L 1600 450" />
					<path d="M 850 0 L 850 1000" />
					<path d="M 1380 0 L 1420 1000" />
					<path d="M 200 0 Q 600 500 1200 1000" />
					<path d="M 0 200 Q 500 400 1000 900" />
				</g>
			</svg>

			{/* Marcadores de Radares e Câmeras Reais com Shimmer Suave */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Radar 1: Agamenon Magalhães (60) */}
				<div className="absolute top-[38%] left-[52%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse">
					<div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center">
						<div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
					</div>
					<div className="px-1.5 py-0.5 bg-white/95 text-[11px] font-bold text-gray-700 rounded shadow-sm border border-gray-200">
						60
					</div>
				</div>

				{/* Radar 2: Av. Boa Viagem (50) */}
				<div className="absolute top-[68%] left-[84%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse [animation-delay:200ms]">
					<div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center">
						<div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
					</div>
					<div className="px-1.5 py-0.5 bg-white/95 text-[11px] font-bold text-gray-700 rounded shadow-sm border border-gray-200">
						50
					</div>
				</div>

				{/* Radar 3: Av. Caxangá (50) */}
				<div className="absolute top-[44%] left-[24%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse [animation-delay:400ms]">
					<div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center">
						<div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
					</div>
					<div className="px-1.5 py-0.5 bg-white/95 text-[11px] font-bold text-gray-700 rounded shadow-sm border border-gray-200">
						50
					</div>
				</div>

				{/* Radar 4: Av. Norte (40) */}
				<div className="absolute top-[22%] left-[46%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse [animation-delay:300ms]">
					<div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center">
						<div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
					</div>
					<div className="px-1.5 py-0.5 bg-white/95 text-[11px] font-bold text-gray-700 rounded shadow-sm border border-gray-200">
						40
					</div>
				</div>

				{/* Radar 5: Av. Recife (60) */}
				<div className="absolute top-[72%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse [animation-delay:500ms]">
					<div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-500 flex items-center justify-center">
						<div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
					</div>
					<div className="px-1.5 py-0.5 bg-white/95 text-[11px] font-bold text-gray-700 rounded shadow-sm border border-gray-200">
						60
					</div>
				</div>

				{/* Câmera 1: Derby / Joana Bezerra */}
				<div className="absolute top-[48%] left-[54%] -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:250ms]">
					<div className="w-7 h-7 rounded-full bg-white shadow-md border-2 border-blue-500 flex items-center justify-center">
						<div className="w-3 h-3 rounded-full bg-blue-500" />
					</div>
				</div>

				{/* Câmera 2: Boa Vista / Centro */}
				<div className="absolute top-[34%] left-[64%] -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:450ms]">
					<div className="w-7 h-7 rounded-full bg-white shadow-md border-2 border-blue-500 flex items-center justify-center">
						<div className="w-3 h-3 rounded-full bg-blue-500" />
					</div>
				</div>

				{/* Câmera 3: Pina */}
				<div className="absolute top-[58%] left-[78%] -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:600ms]">
					<div className="w-7 h-7 rounded-full bg-white shadow-md border-2 border-blue-500 flex items-center justify-center">
						<div className="w-3 h-3 rounded-full bg-blue-500" />
					</div>
				</div>
			</div>

			{/* UI Topo: Barra de Busca */}
			<div className="absolute top-3 left-3 right-3 sm:right-auto z-10 sm:w-80 md:w-96">
				<div className="w-full pl-4 pr-3 py-2.5 sm:py-3 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-between">
					<span className="text-sm sm:text-base text-gray-400 select-none">
						Buscar endereço ou via no Recife...
					</span>
					<div className="p-1.5 text-gray-400">
						<FiSearch size={18} strokeWidth={2.5} />
					</div>
				</div>
			</div>

			{/* UI Topo Direito: Botões de Controle Reais */}
			<div className="absolute top-16 sm:top-3 right-3 z-10 flex flex-wrap items-center gap-2">
				<div className="p-2.5 sm:px-3 sm:py-2 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-amber-600">
					<PiTrafficSignalFill size={20} />
				</div>
				<div className="p-2.5 sm:px-3 sm:py-2 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-blue-600">
					<PiSecurityCameraFill size={20} />
				</div>
				<div className="p-2.5 sm:px-3 sm:py-2 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-gray-600">
					<FiFilter size={18} />
				</div>
				<div className="p-2.5 sm:px-3 sm:py-2 border border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-gray-700">
					<FiCrosshair size={18} />
				</div>
			</div>

			{/* UI Rodapé Esquerdo: Painel de Contadores */}
			<div className="absolute bottom-4 left-3 z-10 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-lg shadow-lg border border-gray-200 text-xs sm:text-sm">
				<div className="flex items-center gap-2 font-medium text-gray-800">
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />
						Radares: <strong>87</strong>
					</span>
					<span className="text-gray-300">|</span>
					<span className="flex items-center gap-1.5">
						<span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse" />
						Câmeras: <strong>51</strong>
					</span>
				</div>
				<p className="text-[11px] text-gray-500 mt-0.5">
					Dados CTTU / Prefeitura da Cidade do Recife
				</p>
			</div>

			{/* UI Rodapé Direito: Botões de Zoom Leaflet */}
			<div className="absolute bottom-6 right-3 z-10 hidden sm:flex flex-col rounded-md shadow-md border border-gray-300 overflow-hidden bg-white/95 backdrop-blur-sm">
				<div className="w-8 h-8 flex items-center justify-center border-b border-gray-200 text-gray-600 font-bold text-base select-none">
					+
				</div>
				<div className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold text-base select-none">
					−
				</div>
			</div>
		</div>
	);
};

export default MapSkeleton;
