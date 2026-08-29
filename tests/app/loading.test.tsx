import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "@/app/loading";

describe("app/loading", () => {
	it("should render the skeleton root container", () => {
		const { container } = render(<Loading />);

		expect(container.firstElementChild).toBeInTheDocument();
	});

	it("should render multiple skeleton marker placeholders", () => {
		const { container } = render(<Loading />);

		const skeletonDots = container.querySelectorAll(".rounded-full");
		expect(skeletonDots.length).toBeGreaterThan(0);
	});

	it("should render the search bar skeleton placeholder", () => {
		const { container } = render(<Loading />);

		const searchSkeleton = container.querySelector(".rounded-2xl");
		expect(searchSkeleton).toBeInTheDocument();
	});
});
