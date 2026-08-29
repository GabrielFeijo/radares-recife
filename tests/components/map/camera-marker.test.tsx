import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CameraMarker } from "@/components/map/camera-marker";
import type { CameraData } from "@/types";

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

const mockCamera: CameraData = {
	id: 42,
	name: "CÂMERA 42 - BOA VISTA",
	address: "Rua da Aurora, 100",
	latitude: -8.058,
	longitude: -34.881,
};

describe("components/map/camera-marker", () => {
	it("should render camera marker and its popup contents", () => {
		render(<CameraMarker camera={mockCamera} />);

		expect(screen.getByTestId("leaflet-marker")).toHaveAttribute(
			"data-title",
			"Rua da Aurora, 100",
		);
		expect(screen.getByText("CÂMERA 42 - BOA VISTA")).toBeInTheDocument();
		expect(screen.getByText("Rua da Aurora, 100")).toBeInTheDocument();
		expect(screen.getByText("#42")).toBeInTheDocument();
	});

	it("should render without id badge when id is falsy", () => {
		const camWithoutId: CameraData = {
			id: 0,
			name: "CAM SEM ID",
			address: "Av Norte",
			latitude: -8.05,
			longitude: -34.88,
		};

		render(<CameraMarker camera={camWithoutId} />);
		expect(screen.getByText("CAM SEM ID")).toBeInTheDocument();
		expect(screen.queryByText("#0")).not.toBeInTheDocument();
	});
});
