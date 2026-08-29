import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AddressSearch from "@/components/search/address-search";
import * as useAddressSearchHook from "@/hooks/use-address-search";
import type { SearchResult } from "@/types";

describe("components/search/address-search", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should render search input, focus, clear and search buttons", () => {
		const onLocationSelect = vi.fn();
		const handleClear = vi.fn();
		const handleSearchManual = vi.fn();
		const setQuery = vi.fn();
		const setShowResults = vi.fn();

		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Agamenon",
			setQuery,
			results: [],
			isLoading: false,
			showResults: false,
			setShowResults,
			handleSelectResult: vi.fn(),
			handleClear,
			handleSearchManual,
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={onLocationSelect} />);

		const input = screen.getByPlaceholderText(
			"Buscar rua, avenida ou via no Recife...",
		);
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue("Agamenon");

		fireEvent.change(input, { target: { value: "Boa Viagem" } });
		expect(setQuery).toHaveBeenCalledWith("Boa Viagem");

		const clearBtn = screen.getByTitle("Limpar busca");
		fireEvent.click(clearBtn);
		expect(handleClear).toHaveBeenCalled();

		const searchBtn = screen.getByTitle("Buscar");
		expect(searchBtn).not.toBeDisabled();
		fireEvent.click(searchBtn);
		expect(handleSearchManual).toHaveBeenCalled();
	});

	it("should disable search button when query length < 3 or isLoading", () => {
		const onLocationSelect = vi.fn();
		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Ag",
			setQuery: vi.fn(),
			results: [],
			isLoading: false,
			showResults: false,
			setShowResults: vi.fn(),
			handleSelectResult: vi.fn(),
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={onLocationSelect} />);
		expect(screen.getByTitle("Buscar")).toBeDisabled();
	});

	it("should show empty state message when no results found", () => {
		const onLocationSelect = vi.fn();
		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Rua Inexistente",
			setQuery: vi.fn(),
			results: [],
			isLoading: false,
			showResults: true,
			setShowResults: vi.fn(),
			handleSelectResult: vi.fn(),
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={onLocationSelect} />);
		expect(
			screen.getByText(/Nenhuma rua ou avenida encontrada para/),
		).toBeInTheDocument();
	});

	it("should render LoadingSkeleton when isLoading is true", () => {
		const onLocationSelect = vi.fn();
		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Agamenon",
			setQuery: vi.fn(),
			results: [],
			isLoading: true,
			showResults: false,
			setShowResults: vi.fn(),
			handleSelectResult: vi.fn(),
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		const { container } = render(
			<AddressSearch onLocationSelect={onLocationSelect} />,
		);
		expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
	});

	it("should render ResultsList with parsed addresses and handle selection", () => {
		const onLocationSelect = vi.fn();
		const handleSelectResult = vi.fn();
		const mockResults: SearchResult[] = [
			{
				place_id: "1",
				display_name:
					"Av. Agamenon Magalhães, Derby, Recife, Pernambuco, Brasil, 52010-000, Região Nordeste",
				lat: "-8.05",
				lon: "-34.88",
			},
			{
				place_id: "2",
				display_name: "Rua do Futuro",
				lat: "-8.06",
				lon: "-34.89",
			},
			{
				place_id: "3",
				display_name: "Rua Exclusiva, Brasil, Região Metropolitana, 50000-000",
				lat: "-8.07",
				lon: "-34.90",
			},
			{
				place_id: "4",
				display_name: "",
				lat: "-8.08",
				lon: "-34.91",
			},
		];

		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Agamenon",
			setQuery: vi.fn(),
			results: mockResults,
			isLoading: false,
			showResults: true,
			setShowResults: vi.fn(),
			handleSelectResult,
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={onLocationSelect} />);

		expect(screen.getByText("Av. Agamenon Magalhães")).toBeInTheDocument();
		expect(screen.getByText("Derby, Recife, Pernambuco")).toBeInTheDocument();
		expect(screen.getByText("Rua do Futuro")).toBeInTheDocument();
		expect(screen.getByText("Rua Exclusiva")).toBeInTheDocument();
		expect(screen.getByText("4 vias")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Av. Agamenon Magalhães"));
		expect(handleSelectResult).toHaveBeenCalledWith(mockResults[0]);
	});

	it("should display singular 'via' badge when results length is 1", () => {
		const mockResults: SearchResult[] = [
			{ place_id: "1", display_name: "Rua Única", lat: "-8.0", lon: "-34.0" },
		];

		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Rua Única",
			setQuery: vi.fn(),
			results: mockResults,
			isLoading: false,
			showResults: true,
			setShowResults: vi.fn(),
			handleSelectResult: vi.fn(),
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={vi.fn()} />);
		expect(screen.getByText("1 via")).toBeInTheDocument();
	});

	it("should trigger setShowResults(true) on input focus when results exist", () => {
		const setShowResults = vi.fn();
		const mockResults: SearchResult[] = [
			{ place_id: "1", display_name: "Rua A", lat: "-8.0", lon: "-34.0" },
		];

		vi.spyOn(useAddressSearchHook, "useAddressSearch").mockReturnValue({
			query: "Rua A",
			setQuery: vi.fn(),
			results: mockResults,
			isLoading: false,
			showResults: false,
			setShowResults,
			handleSelectResult: vi.fn(),
			handleClear: vi.fn(),
			handleSearchManual: vi.fn(),
			searchRef: { current: null },
		});

		render(<AddressSearch onLocationSelect={vi.fn()} />);
		const input = screen.getByPlaceholderText(
			"Buscar rua, avenida ou via no Recife...",
		);
		fireEvent.focus(input);

		expect(setShowResults).toHaveBeenCalledWith(true);
	});
});
