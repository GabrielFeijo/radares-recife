import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MapControlButton } from "@/components/map/map-control-button";

describe("components/map/map-control-button", () => {
	it("should render button with icon and title, and handle click", () => {
		const onClick = vi.fn();
		render(
			<MapControlButton
				onClick={onClick}
				title="Meu Botão"
				icon={<span data-testid="btn-icon">Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Meu Botão" });
		expect(btn).toBeInTheDocument();
		expect(screen.getByTestId("btn-icon")).toBeInTheDocument();

		fireEvent.click(btn);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should render a visual inactive indicator when isActive is false", () => {
		render(
			<MapControlButton
				onClick={vi.fn()}
				isActive={false}
				title="Botão Inativo"
				icon={<span>Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Botão Inativo" });
		const innerDivs = btn.querySelectorAll("div");
		expect(innerDivs.length).toBeGreaterThan(1);
	});

	it("should NOT render the inactive indicator when isActive is true (default)", () => {
		render(
			<MapControlButton
				onClick={vi.fn()}
				isActive={true}
				title="Botão Ativo"
				icon={<span>Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Botão Ativo" });
		const innerDivs = btn.querySelectorAll("div");
		expect(innerDivs.length).toBe(1);
	});

	it("should disable button when disabled is true", () => {
		const onClick = vi.fn();
		render(
			<MapControlButton
				onClick={onClick}
				disabled={true}
				title="Botão Desabilitado"
				icon={<span>Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Botão Desabilitado" });
		expect(btn).toBeDisabled();
		fireEvent.click(btn);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("should use ariaLabel when provided instead of title for accessibility", () => {
		render(
			<MapControlButton
				onClick={vi.fn()}
				title="Título Visível"
				ariaLabel="Rótulo Acessível"
				icon={<span>Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Rótulo Acessível" });
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveAttribute("title", "Título Visível");
		expect(btn).toHaveAttribute("aria-label", "Rótulo Acessível");
	});

	it("should apply custom className to the button element", () => {
		render(
			<MapControlButton
				onClick={vi.fn()}
				title="Botão Custom"
				className="minha-classe-custom"
				icon={<span>Icon</span>}
			/>,
		);

		const btn = screen.getByRole("button", { name: "Botão Custom" });
		expect(btn).toHaveClass("minha-classe-custom");
	});
});
