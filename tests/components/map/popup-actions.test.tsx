import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopupActions } from "@/components/map/popup-actions";

describe("components/map/popup-actions", () => {
	it("should render Street View and Directions links with valid URLs", () => {
		render(
			<PopupActions
				latitude={-8.0584}
				longitude={-34.8848}
				showDirections={true}
				primaryLabel="Street View"
			/>,
		);

		const streetViewLink = screen.getByRole("link", { name: /Street View/i });
		expect(streetViewLink).toHaveAttribute(
			"href",
			"https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-8.0584,-34.8848",
		);

		const directionsLink = screen.getByRole("link", { name: /Como Chegar/i });
		expect(directionsLink).toHaveAttribute(
			"href",
			"https://www.google.com/maps/dir/?api=1&destination=-8.0584,-34.8848",
		);
	});

	it("should hide directions button when showDirections is false", () => {
		render(
			<PopupActions
				latitude={-8.0584}
				longitude={-34.8848}
				showDirections={false}
				primaryLabel="Ver no Mapa"
			/>,
		);

		expect(
			screen.getByRole("link", { name: /Ver no Mapa/i }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /Como Chegar/i }),
		).not.toBeInTheDocument();
	});
});
