import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import L from "leaflet";
import { afterEach, beforeEach, vi } from "vitest";

(globalThis as any).L = L;
(window as any).L = L;

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	cleanup();
});
