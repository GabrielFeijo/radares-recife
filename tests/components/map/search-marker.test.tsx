import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchMarker } from "@/components/map/search-marker";
import type { SearchLocation } from "@/types";

vi.mock("react-leaflet", () => ({
	Marker: ({ children }: any) => (
		<div data-testid="leaflet-marker">{children}</div>
	),
	Popup: ({ children }: any) => (
		<div data-testid="leaflet-popup">{children}</div>
	),
}));

describe("components/map/search-marker", () => {
	it("should render parsed title and subtitle when address contains commas", () => {
		const location: SearchLocation = {
			lat: -8.058,
			lon: -34.881,
			address: "Av. Agamenon Magalhães, Derby, Recife",
		};

		render(<SearchMarker location={location} />);

		expect(screen.getByText("Av. Agamenon Magalhães")).toBeInTheDocument();
		expect(screen.getByText("Derby, Recife")).toBeInTheDocument();
		expect(screen.getByText("Local Pesquisado")).toBeInTheDocument();
		expect(screen.getByText("Destino")).toBeInTheDocument();
	});

	it("should render title only when address has no commas", () => {
		const location: SearchLocation = {
			lat: -8.058,
			lon: -34.881,
			address: "Praça do Derby",
		};

		render(<SearchMarker location={location} />);

		expect(screen.getByText("Praça do Derby")).toBeInTheDocument();
	});
});
