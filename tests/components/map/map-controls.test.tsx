import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MapControls } from "@/components/map/map-controls";
import type { MapControlsState } from "@/hooks/use-map-controls";

describe("components/map/map-controls", () => {
	it("should render all 5 control buttons and respond to user clicks", () => {
		const toggleRadars = vi.fn();
		const toggleCameras = vi.fn();
		const toggleSpeedLabels = vi.fn();
		const toggleSpeedFilter = vi.fn();
		const onLocate = vi.fn();

		const controls: MapControlsState = {
			showRadars: true,
			showCameras: false,
			showSpeedLabels: true,
			selectedSpeed: "all",
			showSpeedFilter: false,
			availableSpeeds: ["40 km/h", "60 km/h"],
			filteredRadars: [],
			toggleRadars,
			toggleCameras,
			toggleSpeedLabels,
			toggleSpeedFilter,
			selectSpeed: vi.fn(),
		};

		render(
			<MapControls
				controls={controls}
				isLocating={false}
				onLocate={onLocate}
			/>,
		);

		const radarsBtn = screen.getByTitle("Ocultar Radares");
		fireEvent.click(radarsBtn);
		expect(toggleRadars).toHaveBeenCalled();

		const camerasBtn = screen.getByTitle("Exibir Câmeras");
		fireEvent.click(camerasBtn);
		expect(toggleCameras).toHaveBeenCalled();

		const labelsBtn = screen.getByTitle("Ocultar Etiquetas de Velocidade");
		fireEvent.click(labelsBtn);
		expect(toggleSpeedLabels).toHaveBeenCalled();

		const filterBtn = screen.getByTitle("Filtrar por velocidade");
		fireEvent.click(filterBtn);
		expect(toggleSpeedFilter).toHaveBeenCalled();

		const locateBtn = screen.getByTitle("Minha Localização");
		fireEvent.click(locateBtn);
		expect(onLocate).toHaveBeenCalled();
	});

	it("should disable locate button when isLocating is true", () => {
		const controls: MapControlsState = {
			showRadars: false,
			showCameras: true,
			showSpeedLabels: false,
			selectedSpeed: "60 km/h",
			showSpeedFilter: true,
			availableSpeeds: [],
			filteredRadars: [],
			toggleRadars: vi.fn(),
			toggleCameras: vi.fn(),
			toggleSpeedLabels: vi.fn(),
			toggleSpeedFilter: vi.fn(),
			selectSpeed: vi.fn(),
		};

		render(
			<MapControls controls={controls} isLocating={true} onLocate={vi.fn()} />,
		);

		const locateBtn = screen.getByTitle("Minha Localização");
		expect(locateBtn).toBeDisabled();
	});
});
