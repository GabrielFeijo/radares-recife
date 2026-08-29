import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopupHeader } from "@/components/map/popup-header";

describe("components/map/popup-header", () => {
	it("should render category name and badge", () => {
		render(
			<PopupHeader
				category="Fiscalização Eletrônica"
				variant="radar"
				badge="#123"
				icon={<span data-testid="test-icon">Icon</span>}
			/>,
		);

		expect(screen.getByText("Fiscalização Eletrônica")).toBeInTheDocument();
		expect(screen.getByText("#123")).toBeInTheDocument();
		expect(screen.getByTestId("test-icon")).toBeInTheDocument();
	});

	it("should support different category variants (radar, camera, search, location, neutral)", () => {
		const { rerender } = render(
			<PopupHeader category="Radar" variant="radar" />,
		);
		expect(screen.getByText("Radar")).toBeInTheDocument();

		rerender(<PopupHeader category="Camera" variant="camera" />);
		expect(screen.getByText("Camera")).toBeInTheDocument();

		rerender(<PopupHeader category="Search" variant="search" />);
		expect(screen.getByText("Search")).toBeInTheDocument();

		rerender(<PopupHeader category="Location" variant="location" />);
		expect(screen.getByText("Location")).toBeInTheDocument();

		rerender(<PopupHeader category="Neutral" variant="neutral" />);
		expect(screen.getByText("Neutral")).toBeInTheDocument();
	});
});
