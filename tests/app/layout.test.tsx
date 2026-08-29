import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata, viewport } from "@/app/layout";

vi.mock("next/font/google", () => ({
	Plus_Jakarta_Sans: () => ({
		variable: "--font-sans",
		className: "font-sans-mock",
	}),
}));

vi.mock("@/providers/query-client-provider", () => ({
	ReactQueryClientProvider: ({ children }: any) => (
		<div data-testid="query-provider">{children}</div>
	),
}));

describe("app/layout", () => {
	it("should export valid metadata and viewport", () => {
		expect(metadata.title).toContain("Radares e Câmeras do Recife");
		expect(metadata.description).toBeDefined();
		expect(metadata.keywords).toBeDefined();
		expect(viewport.width).toBe("device-width");
		expect(viewport.themeColor).toBe("#f8fafc");
	});

	it("should render RootLayout with HTML, children and QueryProvider", () => {
		render(
			<RootLayout>
				<div data-testid="app-content">App Body</div>
			</RootLayout>,
		);

		expect(screen.getByTestId("query-provider")).toBeInTheDocument();
		expect(screen.getByTestId("app-content")).toBeInTheDocument();
		expect(screen.getByText("App Body")).toBeInTheDocument();
	});
});
