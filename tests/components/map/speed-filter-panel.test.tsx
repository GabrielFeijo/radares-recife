import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpeedFilterPanel } from "@/components/map/speed-filter-panel";
import type { RadarData } from "@/types";

const mockRadars: RadarData[] = [
	{ id: 1, monitoredSpeed: "60 km/h" } as any,
	{ id: 2, monitoredSpeed: "60 km/h" } as any,
	{ id: 3, monitoredSpeed: "40 km/h" } as any,
];

describe("components/map/speed-filter-panel", () => {
	it("should render speed filter options with counts and handle selection", () => {
		const onSelectSpeed = vi.fn();

		render(
			<SpeedFilterPanel
				radars={mockRadars}
				availableSpeeds={["40 km/h", "60 km/h"]}
				selectedSpeed="60 km/h"
				onSelectSpeed={onSelectSpeed}
			/>,
		);

		expect(screen.getByText("Filtrar por Velocidade")).toBeInTheDocument();

		expect(screen.getByText("Todas as velocidades")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();

		expect(screen.getByText("40 km/h")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();

		expect(screen.getByText("60 km/h")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();

		fireEvent.click(screen.getByText("40 km/h"));
		expect(onSelectSpeed).toHaveBeenCalledWith("40 km/h");

		fireEvent.click(screen.getByText("Todas as velocidades"));
		expect(onSelectSpeed).toHaveBeenCalledWith("all");
	});
});
