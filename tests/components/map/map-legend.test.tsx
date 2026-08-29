import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapLegend } from "@/components/map/map-legend";

describe("components/map/map-legend", () => {
	it("should render radar count, camera count, and data attribution", () => {
		render(<MapLegend radarCount={120} cameraCount={45} selectedSpeed="all" />);

		expect(screen.getByText("Radares")).toBeInTheDocument();
		expect(screen.getByText("120")).toBeInTheDocument();
		expect(screen.getByText("Câmeras")).toBeInTheDocument();
		expect(screen.getByText("45")).toBeInTheDocument();
		expect(
			screen.getByText(/CTTU \/ Prefeitura da Cidade do Recife/i),
		).toBeInTheDocument();
	});

	it("should display selectedSpeed badge when not 'all'", () => {
		render(
			<MapLegend radarCount={30} cameraCount={45} selectedSpeed="60 km/h" />,
		);

		expect(screen.getByText("60 km/h")).toBeInTheDocument();
	});
});
