import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
	MapController,
	type MapControllerHandle,
} from "@/components/map/map-controller";

const flyToMock = vi.fn();
const setPositionMock = vi.fn();

vi.mock("react-leaflet", () => ({
	useMap: () => ({
		zoomControl: {
			setPosition: setPositionMock,
		},
		flyTo: flyToMock,
	}),
}));

describe("components/map/map-controller", () => {
	it("should set zoomControl to bottomright and expose flyTo via controllerRef", () => {
		const controllerRef = createRef<MapControllerHandle>();

		render(<MapController controllerRef={controllerRef} />);

		expect(setPositionMock).toHaveBeenCalledWith("bottomright");
		expect(controllerRef.current).toBeDefined();
		expect(typeof controllerRef.current?.flyTo).toBe("function");

		controllerRef.current?.flyTo(-8.0584, -34.8848, 16);
		expect(flyToMock).toHaveBeenCalledWith([-8.0584, -34.8848], 16, {
			duration: 1.5,
		});
	});
});
