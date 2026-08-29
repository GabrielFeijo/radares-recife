import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserLocationMarker } from "@/components/map/user-location-marker";

vi.mock("react-leaflet", () => ({
	Marker: ({ children }: any) => (
		<div data-testid="leaflet-marker">{children}</div>
	),
	Popup: ({ children }: any) => (
		<div data-testid="leaflet-popup">{children}</div>
	),
}));

describe("components/map/user-location-marker", () => {
	it("should render user location marker with popup details", () => {
		const location = { lat: -8.058, lon: -34.881 };

		render(<UserLocationMarker location={location} />);

		expect(screen.getByText("Sua Localização")).toBeInTheDocument();
		expect(screen.getByText("Ao Vivo")).toBeInTheDocument();
		expect(screen.getByText("Localização Atual")).toBeInTheDocument();
		expect(
			screen.getByText("Geolocalização obtida via sensor do navegador"),
		).toBeInTheDocument();
	});
});
