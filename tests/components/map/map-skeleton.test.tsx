import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapSkeleton } from "@/components/map/map-skeleton";

describe("components/map/map-skeleton", () => {
	it("should render the skeleton root container", () => {
		const { container } = render(<MapSkeleton />);

		expect(container.firstElementChild).toBeInTheDocument();
	});

	it("should render multiple placeholder map marker dots", () => {
		const { container } = render(<MapSkeleton />);

		const dots = container.querySelectorAll(".rounded-full");
		expect(dots.length).toBeGreaterThan(0);
	});

	it("should render placeholder control buttons on the right side", () => {
		const { container } = render(<MapSkeleton />);

		const controlButtons = container.querySelectorAll(
			".w-10.h-10, .sm\\:w-11.sm\\:h-11",
		);
		expect(controlButtons.length).toBeGreaterThan(0);
	});

	it("should render the search bar placeholder at the top", () => {
		const { container } = render(<MapSkeleton />);

		const searchBar = container.querySelector(".rounded-2xl");
		expect(searchBar).toBeInTheDocument();
	});
});
