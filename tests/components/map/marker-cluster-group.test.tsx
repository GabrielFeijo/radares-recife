import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkerClusterGroup } from "@/components/map/marker-cluster-group";

vi.mock("@react-leaflet/core", () => ({
	createPathComponent: (factory: any) => {
		return function MockComponent(props: any) {
			const result = factory(props, { __test_context: true });
			return (
				<div
					data-testid="marker-cluster-group"
					data-instance={!!result.instance}
				>
					{props.children}
				</div>
			);
		};
	},
	extendContext: (ctx: any, ext: any) => ({ ...ctx, ...ext }),
}));

vi.mock("leaflet", () => {
	const L = {
		markerClusterGroup: vi.fn().mockImplementation((opts) => ({
			_opts: opts,
			addLayer: vi.fn(),
		})),
	};
	return { default: L, ...L };
});

describe("components/map/marker-cluster-group", () => {
	it("should create marker cluster component and render children", () => {
		const { getByTestId, getByText } = render(
			<MarkerClusterGroup chunkedLoading maxClusterRadius={45}>
				<div>Child Marker</div>
			</MarkerClusterGroup>,
		);

		expect(getByTestId("marker-cluster-group")).toBeInTheDocument();
		expect(getByText("Child Marker")).toBeInTheDocument();
	});
});
