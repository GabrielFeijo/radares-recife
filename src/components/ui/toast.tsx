"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

export type ToastVariant = "error" | "info" | "success";

interface ToastItem {
	id: string;
	message: string;
	variant: ToastVariant;
}

interface ToastContextValue {
	toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
	return ctx;
}

const TOAST_DURATION_MS = 4000;

const VARIANT_ICON: Record<ToastVariant, React.ReactNode> = {
	error: <FiAlertCircle size={16} className="shrink-0 text-rose-600" />,
	info: <FiInfo size={16} className="shrink-0 text-sky-600" />,
	success: <FiCheckCircle size={16} className="shrink-0 text-emerald-600" />,
};

const VARIANT_STYLE: Record<ToastVariant, string> = {
	error:
		"border-rose-200/90 bg-rose-50/95 backdrop-blur-xl text-rose-900 shadow-glass-md",
	info: "border-sky-200/90 bg-sky-50/95 backdrop-blur-xl text-sky-900 shadow-glass-md",
	success:
		"border-emerald-200/90 bg-emerald-50/95 backdrop-blur-xl text-emerald-900 shadow-glass-md",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const toast = useCallback(
		(message: string, variant: ToastVariant = "info") => {
			const id = String(Date.now());
			setToasts((prev) => [...prev, { id, message, variant }]);
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, TOAST_DURATION_MS);
		},
		[],
	);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div
				aria-live="polite"
				aria-atomic="false"
				className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none max-w-sm w-full"
			>
				{toasts.map((t) => (
					<div
						key={t.id}
						role="alert"
						className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${VARIANT_STYLE[t.variant]}`}
					>
						{VARIANT_ICON[t.variant]}
						<span className="flex-1 leading-snug">{t.message}</span>
						<button
							type="button"
							onClick={() => dismiss(t.id)}
							className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0 mt-0.5"
							aria-label="Fechar notificação"
						>
							<FiX size={14} />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}
