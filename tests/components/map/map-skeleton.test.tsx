import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapSkeleton } from "@/components/map/map-skeleton";

describe("components/map/map-skeleton", () => {
	it("should render skeleton container with animate-pulse class", () => {
		const { container } = render(<MapSkeleton />);
		expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
	});
});
