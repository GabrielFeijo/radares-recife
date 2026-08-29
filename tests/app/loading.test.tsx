import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "@/app/loading";

describe("app/loading", () => {
	it("should render MapSkeleton component", () => {
		const { container } = render(<Loading />);
		expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
	});
});
