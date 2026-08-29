import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReactQueryClientProvider } from "@/providers/query-client-provider";

describe("providers/query-client-provider", () => {
	it("should render children correctly wrapped in QueryClientProvider", () => {
		render(
			<ReactQueryClientProvider>
				<div data-testid="child-element">Child Content</div>
			</ReactQueryClientProvider>,
		);

		expect(screen.getByTestId("child-element")).toBeInTheDocument();
		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});
});
