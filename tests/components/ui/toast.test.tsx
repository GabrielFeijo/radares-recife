import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "@/components/ui/toast";

function TestToastConsumer() {
	const { toast } = useToast();
	return (
		<div>
			<button type="button" onClick={() => toast("Erro de teste", "error")}>
				Trigger Error Toast
			</button>
			<button type="button" onClick={() => toast("Info de teste", "info")}>
				Trigger Info Toast
			</button>
			<button
				type="button"
				onClick={() => toast("Sucesso de teste", "success")}
			>
				Trigger Success Toast
			</button>
			<button type="button" onClick={() => toast("Default variant toast")}>
				Trigger Default Toast
			</button>
		</div>
	);
}

describe("components/ui/toast", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should throw error when useToast is used outside of ToastProvider", () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const errorHandler = (e: ErrorEvent) => {
			e.preventDefault();
		};
		window.addEventListener("error", errorHandler);

		expect(() => renderHook(() => useToast())).toThrow(
			"useToast must be used within <ToastProvider>",
		);

		window.removeEventListener("error", errorHandler);
		consoleSpy.mockRestore();
	});

	it("should render toasts for all variants and auto-dismiss after 4000ms", () => {
		render(
			<ToastProvider>
				<TestToastConsumer />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Trigger Error Toast"));
		expect(screen.getByText("Erro de teste")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Trigger Info Toast"));
		expect(screen.getByText("Info de teste")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Trigger Success Toast"));
		expect(screen.getByText("Sucesso de teste")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Trigger Default Toast"));
		expect(screen.getByText("Default variant toast")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(4000);
		});

		expect(screen.queryByText("Erro de teste")).not.toBeInTheDocument();
		expect(screen.queryByText("Info de teste")).not.toBeInTheDocument();
		expect(screen.queryByText("Sucesso de teste")).not.toBeInTheDocument();
		expect(screen.queryByText("Default variant toast")).not.toBeInTheDocument();
	});

	it("should allow manual dismissal of a toast", () => {
		render(
			<ToastProvider>
				<TestToastConsumer />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Trigger Info Toast"));
		expect(screen.getByText("Info de teste")).toBeInTheDocument();

		const dismissBtn = screen.getByLabelText("Fechar notificação");
		fireEvent.click(dismissBtn);

		expect(screen.queryByText("Info de teste")).not.toBeInTheDocument();
	});

	it("should correctly handle individual dismissals among multiple toasts triggered at the same timestamp", () => {
		render(
			<ToastProvider>
				<TestToastConsumer />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Trigger Error Toast"));
		fireEvent.click(screen.getByText("Trigger Info Toast"));

		expect(screen.getByText("Erro de teste")).toBeInTheDocument();
		expect(screen.getByText("Info de teste")).toBeInTheDocument();

		const dismissButtons = screen.getAllByLabelText("Fechar notificação");
		expect(dismissButtons).toHaveLength(2);

		fireEvent.click(dismissButtons[0]);

		expect(screen.queryByText("Erro de teste")).not.toBeInTheDocument();
		expect(screen.getByText("Info de teste")).toBeInTheDocument();
	});
});
