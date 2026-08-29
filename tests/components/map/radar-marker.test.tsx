import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadarMarker } from "@/components/map/radar-marker";
import type { RadarData } from "@/types";

vi.mock("react-leaflet", () => ({
	Marker: ({ children, title }: any) => (
		<div data-testid="leaflet-marker" data-title={title}>
			{children}
		</div>
	),
	Popup: ({ children }: any) => (
		<div data-testid="leaflet-popup">{children}</div>
	),
}));

const mockRadar: RadarData = {
	id: 101,
	equipmentType: "Lombada Eletrônica",
	inmetroRegistration: "INM-999",
	manufacturerSerialNumber: "SER-888",
	equipmentIdentification: "CTTU-55",
	installationLocation: "Av. Governador Agamenon Magalhães, 2000",
	monitoringDirection: "Sentido Olinda",
	latitude: -8.058,
	longitude: -34.881,
	monitoredLanes: 3,
	monitoredSpeed: "60 km/h",
	vmd: 15400,
	vmdPeriod: "2024",
};

describe("components/map/radar-marker", () => {
	it("should render full radar marker popup with all details", () => {
		render(<RadarMarker radar={mockRadar} showLabel={true} />);

		expect(screen.getByTestId("leaflet-marker")).toHaveAttribute(
			"data-title",
			"Av. Governador Agamenon Magalhães, 2000 (60 km/h)",
		);

		expect(screen.getByText("Lombada Eletrônica")).toBeInTheDocument();
		expect(screen.getByText("#CTTU-55")).toBeInTheDocument();
		expect(
			screen.getByText("Av. Governador Agamenon Magalhães, 2000"),
		).toBeInTheDocument();
		expect(screen.getByText("Sentido Olinda")).toBeInTheDocument();

		expect(screen.getByText("60")).toBeInTheDocument();
		expect(screen.getByText("km/h")).toBeInTheDocument();

		expect(screen.getByText("3 ativas")).toBeInTheDocument();

		expect(screen.getByText("15.400")).toBeInTheDocument();
		expect(screen.getByText("2024")).toBeInTheDocument();

		expect(screen.getByText("INMETRO: INM-999")).toBeInTheDocument();
		expect(screen.getByText("SÉRIE: SER-888")).toBeInTheDocument();
	});

	it("should render fallback text for direction, lane singular, and 0 vmd", () => {
		const minimalRadar: RadarData = {
			id: 102,
			equipmentType: "",
			inmetroRegistration: "",
			manufacturerSerialNumber: "",
			equipmentIdentification: "",
			installationLocation: "Rua do Hospício",
			monitoringDirection: "",
			latitude: -8.058,
			longitude: -34.881,
			monitoredLanes: 1,
			monitoredSpeed: "",
			vmd: 0,
			vmdPeriod: "",
		};

		render(<RadarMarker radar={minimalRadar} showLabel={false} />);

		expect(screen.getByText("Fiscalização Eletrônica")).toBeInTheDocument();
		expect(screen.getByText("CTTU")).toBeInTheDocument();
		expect(screen.getByText("Ambos os sentidos")).toBeInTheDocument();
		expect(screen.getByText("1 ativa")).toBeInTheDocument();
		expect(screen.getByText("Não informado")).toBeInTheDocument();
	});
});
