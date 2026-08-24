"use client";

import { useCallback, useState } from "react";

export function useClipboard(timeoutMs = 2000) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(
		async (text: string): Promise<boolean> => {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), timeoutMs);
				return true;
			} catch {
				return false;
			}
		},
		[timeoutMs],
	);

	return { copied, copy };
}
