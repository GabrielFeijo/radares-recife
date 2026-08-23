export function MapSkeleton() {
	return (
		<div className="relative w-full h-full min-h-screen bg-slate-100 overflow-hidden select-none animate-pulse">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

			<div className="absolute top-[28%] left-[24%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[40%] left-[52%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[55%] left-[38%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[35%] left-[68%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[65%] left-[75%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[20%] left-[45%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />
			<div className="absolute top-[72%] left-[48%] w-6 h-6 rounded-full bg-slate-300 shadow-sm" />

			<div className="absolute top-3 left-3 right-3 sm:right-auto z-10 sm:w-80 md:w-96">
				<div className="w-full h-11 sm:h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-between px-4">
					<div className="h-4 w-40 bg-slate-200 rounded-md" />
					<div className="w-5 h-5 bg-slate-200 rounded-full" />
				</div>
			</div>

			<div className="absolute top-16 sm:top-3 right-3 z-10 flex flex-wrap items-center gap-2">
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
					<div className="w-5 h-5 bg-slate-200 rounded-md" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
					<div className="w-5 h-5 bg-slate-200 rounded-md" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
					<div className="w-5 h-5 bg-slate-200 rounded-md" />
				</div>
				<div className="w-10 h-10 sm:w-11 sm:h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
					<div className="w-5 h-5 bg-slate-200 rounded-md" />
				</div>
			</div>

			<div className="absolute bottom-4 left-3 z-10 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-200/80 min-w-56 space-y-2">
				<div className="flex items-center gap-3">
					<div className="h-4 w-24 bg-slate-200 rounded-md" />
					<div className="h-4 w-24 bg-slate-200 rounded-md" />
				</div>
				<div className="h-3 w-40 bg-slate-200/70 rounded-md" />
			</div>
		</div>
	);
}

export default MapSkeleton;
