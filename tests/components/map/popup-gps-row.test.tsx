import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PopupGpsRow } from "@/components/map/popup-gps-row";
import * as useClipboardHook from "@/hooks/use-clipboard";

describe("components/map/popup-gps-row", () => {
	it("should render formatted GPS coords and trigger copy on click", () => {
		const copyMock = vi.fn();
		vi.spyOn(useClipboardHook, "useClipboard").mockReturnValue({
			copied: false,
			copy: copyMock,
		});

		render(<PopupGpsRow latitude={-8.058412} longitude={-34.884891} />);

		expect(screen.getByText("-8.05841, -34.88489")).toBeInTheDocument();
		expect(screen.getByText("Copiar")).toBeInTheDocument();

		const button = screen.getByLabelText("Copiar coordenadas GPS");
		fireEvent.click(button);

		expect(copyMock).toHaveBeenCalledWith("-8.058412, -34.884891");
	});

	it("should render 'Copiado' state when copied is true", () => {
		vi.spyOn(useClipboardHook, "useClipboard").mockReturnValue({
			copied: true,
			copy: vi.fn(),
		});

		render(<PopupGpsRow latitude={-8.058412} longitude={-34.884891} />);
		expect(screen.getByText("Copiado")).toBeInTheDocument();
	});
});
