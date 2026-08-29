import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MapComponent from "@/components/map/map-component";
import * as useCamerasHook from "@/hooks/use-cameras";
import * as useGeolocationHook from "@/hooks/use-geolocation";
import * as useMapControlsHook from "@/hooks/use-map-controls";
import * as useRadarsHook from "@/hooks/use-radars";
import type { CameraData, RadarData } from "@/types";

vi.mock("react-leaflet", () => ({
	MapContainer: ({ children }: any) => (
		<div data-testid="map-container">{children}</div>
	),
	TileLayer: () => <div data-testid="tile-layer" />,
	Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
	Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
	useMap: () => ({
		zoomControl: { setPosition: vi.fn() },
		flyTo: vi.fn(),
	}),
}));

vi.mock("@/components/map/marker-cluster-group", () => ({
	MarkerClusterGroup: ({ children }: any) => (
		<div data-testid="cluster-group">{children}</div>
	),
}));

vi.mock("@/components/search/address-search", () => ({
	default: ({ onLocationSelect }: any) => (
		<button
			type="button"
			data-testid="mock-search"
			onClick={() => onLocationSelect(-8.05, -34.88, "Av Agamenon")}
		>
			Search Location
		</button>
	),
}));

const mockRadars: RadarData[] = [
	{
		id: 1,
		equipmentType: "Radar",
		installationLocation: "Rua 1",
		latitude: -8.05,
		longitude: -34.88,
		monitoredSpeed: "60 km/h",
	} as any,
];

const mockCameras: CameraData[] = [
	{
		id: 10,
		name: "Cam 10",
		address: "Rua 2",
		latitude: -8.06,
		longitude: -34.89,
	},
];

describe("components/map/map-component", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should render MapSkeleton while loading", () => {
		vi.spyOn(useRadarsHook, "useRadars").mockReturnValue({
			data: [],
			isLoading: true,
		} as any);
		vi.spyOn(useCamerasHook, "useCameras").mockReturnValue({
			data: [],
			isLoading: false,
		} as any);

		const { container } = render(<MapComponent />);
		expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
	});

	it("should render full map with controls, markers, legend, and panels when loaded", () => {
		vi.spyOn(useRadarsHook, "useRadars").mockReturnValue({
			data: mockRadars,
			isLoading: false,
		} as any);
		vi.spyOn(useCamerasHook, "useCameras").mockReturnValue({
			data: mockCameras,
			isLoading: false,
		} as any);

		const locateMock = vi.fn().mockImplementation((onSuccess) => {
			onSuccess?.(-8.07, -34.9);
		});

		vi.spyOn(useGeolocationHook, "useGeolocation").mockReturnValue({
			userLocation: { lat: -8.07, lon: -34.9 },
			isLocating: false,
			locate: locateMock,
		});

		render(<MapComponent />);

		expect(screen.getByTestId("map-container")).toBeInTheDocument();
		expect(screen.getByTestId("mock-search")).toBeInTheDocument();
		expect(screen.getByText("Radares")).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("mock-search"));
		expect(screen.getByText("Av Agamenon")).toBeInTheDocument();

		const locateBtn = screen.getByTitle("Minha Localização");
		fireEvent.click(locateBtn);
		expect(locateMock).toHaveBeenCalled();
	});

	it("should render speed filter panel and camera clusters when toggled", () => {
		vi.spyOn(useRadarsHook, "useRadars").mockReturnValue({
			data: mockRadars,
			isLoading: false,
		} as any);
		vi.spyOn(useCamerasHook, "useCameras").mockReturnValue({
			data: mockCameras,
			isLoading: false,
		} as any);

		vi.spyOn(useMapControlsHook, "useMapControls").mockReturnValue({
			showRadars: false,
			showCameras: true,
			showSpeedLabels: false,
			selectedSpeed: "all",
			showSpeedFilter: true,
			availableSpeeds: ["60 km/h"],
			filteredRadars: [],
			toggleRadars: vi.fn(),
			toggleCameras: vi.fn(),
			toggleSpeedLabels: vi.fn(),
			toggleSpeedFilter: vi.fn(),
			selectSpeed: vi.fn(),
		});

		render(<MapComponent />);

		expect(screen.getByText("Filtrar por Velocidade")).toBeInTheDocument();
		expect(screen.getByText("Cam 10")).toBeInTheDocument();
	});
});
