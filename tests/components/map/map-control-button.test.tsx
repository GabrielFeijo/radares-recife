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

		const btn = screen.getByTitle("Meu Botão");
		expect(btn).toBeInTheDocument();
		expect(screen.getByTestId("btn-icon")).toBeInTheDocument();

		fireEvent.click(btn);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should render inactive slash line when isActive is false", () => {
		const { container } = render(
			<MapControlButton
				onClick={vi.fn()}
				isActive={false}
				title="Botão Inativo"
				icon={<span>Icon</span>}
			/>,
		);

		expect(container.querySelector(".bg-rose-500")).toBeInTheDocument();
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

		const btn = screen.getByTitle("Botão Desabilitado");
		expect(btn).toBeDisabled();
		fireEvent.click(btn);
		expect(onClick).not.toHaveBeenCalled();
	});
});
