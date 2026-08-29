import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("next/dynamic", () => ({
	default: (importer: any, opts: any) => {
		importer();
		const LoadingComponent = opts?.loading;
		return function MockDynamicComponent() {
			return (
				<div data-testid="dynamic-map-component">
					{LoadingComponent && <LoadingComponent />}
					Map Component Mock
				</div>
			);
		};
	},
}));

describe("app/page - Home", () => {
	it("should render main tag and MapComponent", () => {
		render(<Home />);
		expect(screen.getByRole("main")).toBeInTheDocument();
		expect(screen.getByTestId("dynamic-map-component")).toBeInTheDocument();
	});
});
