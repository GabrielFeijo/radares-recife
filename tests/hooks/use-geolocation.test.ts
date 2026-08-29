import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "@/hooks/use-geolocation";

const toastMock = vi.fn();
vi.mock("@/components/ui/toast", () => ({
	useToast: () => ({ toast: toastMock }),
}));

describe("hooks/use-geolocation", () => {
	const originalGeolocation = navigator.geolocation;

	afterEach(() => {
		Object.defineProperty(navigator, "geolocation", {
			value: originalGeolocation,
			writable: true,
		});
		vi.clearAllMocks();
	});

	it("should show error toast if geolocation is not supported", () => {
		Object.defineProperty(navigator, "geolocation", {
			value: undefined,
			writable: true,
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.locate();
		});

		expect(toastMock).toHaveBeenCalledWith(
			"Geolocalização não é suportada pelo seu navegador.",
			"error",
		);
		expect(result.current.isLocating).toBe(false);
		expect(result.current.userLocation).toBeNull();
	});

	it("should set user location and invoke onSuccess callback on success", () => {
		const getCurrentPositionMock = vi.fn().mockImplementation((success) => {
			success({
				coords: {
					latitude: -8.0584,
					longitude: -34.8848,
				},
			});
		});

		Object.defineProperty(navigator, "geolocation", {
			value: { getCurrentPosition: getCurrentPositionMock },
			writable: true,
		});

		const onSuccessMock = vi.fn();
		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.locate(onSuccessMock);
		});

		expect(result.current.userLocation).toEqual({
			lat: -8.0584,
			lon: -34.8848,
		});
		expect(result.current.isLocating).toBe(false);
		expect(onSuccessMock).toHaveBeenCalledWith(-8.0584, -34.8848);
	});

	it("should show error toast and reset isLocating on geolocation error", () => {
		const getCurrentPositionMock = vi.fn().mockImplementation((_, error) => {
			error(new Error("Position unavailable"));
		});

		Object.defineProperty(navigator, "geolocation", {
			value: { getCurrentPosition: getCurrentPositionMock },
			writable: true,
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.locate();
		});

		expect(toastMock).toHaveBeenCalledWith(
			"Não foi possível obter sua localização. Verifique as permissões do navegador.",
			"error",
		);
		expect(result.current.isLocating).toBe(false);
		expect(result.current.userLocation).toBeNull();
	});
});
