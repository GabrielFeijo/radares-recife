export interface SpeedParts {
	value: string;
	unit: string;
}

export interface SpeedBadgeInfo extends SpeedParts {
	textSize: string;
}

export function parseSpeedParts(speed?: string): SpeedParts {
	if (!speed?.trim()) {
		return { value: "Radar", unit: "" };
	}

	const raw = speed.trim();

	const multiMatch = raw.match(/(\d+)\s*(?:km\/h|kmh)?\s*e\s*(\d+)/i);
	if (multiMatch) {
		return {
			value: `${multiMatch[1]} / ${multiMatch[2]}`,
			unit: "km/h",
		};
	}

	const clean = raw
		.replace(/km\s*\/\s*h/gi, "")
		.replace(/kmh/gi, "")
		.trim();

	return {
		value: clean || raw,
		unit: "km/h",
	};
}

export function getSpeedBadgeInfo(speed?: string): SpeedBadgeInfo {
	const parts = parseSpeedParts(speed);

	if (!speed?.trim()) {
		return { ...parts, textSize: "text-xs" };
	}

	const { value } = parts;
	let textSize = "text-sm";
	if (value.length > 7) {
		textSize = "text-[8.5px]";
	} else if (value.length > 4) {
		textSize = "text-[9.5px]";
	} else if (value.length > 2) {
		textSize = "text-xs";
	}

	return { ...parts, textSize };
}
