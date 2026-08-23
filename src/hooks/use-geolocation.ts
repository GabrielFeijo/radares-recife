"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { GEOLOCATION_CONFIG } from "@/constants/map";

export interface UserLocation {
	lat: number;
	lon: number;
}

export interface UseGeolocationReturn {
	userLocation: UserLocation | null;
	isLocating: boolean;
	locate: (onSuccess?: (lat: number, lon: number) => void) => void;
}

export function useGeolocation(): UseGeolocationReturn {
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
	const [isLocating, setIsLocating] = useState(false);
	const { toast } = useToast();

	const locate = useCallback(
		(onSuccess?: (lat: number, lon: number) => void) => {
			if (!navigator.geolocation) {
				toast("Geolocalização não é suportada pelo seu navegador.", "error");
				return;
			}

			setIsLocating(true);

			navigator.geolocation.getCurrentPosition(
				({ coords }) => {
					const { latitude, longitude } = coords;
					setUserLocation({ lat: latitude, lon: longitude });
					onSuccess?.(latitude, longitude);
					setIsLocating(false);
				},
				() => {
					toast(
						"Não foi possível obter sua localização. Verifique as permissões do navegador.",
						"error",
					);
					setIsLocating(false);
				},
				GEOLOCATION_CONFIG,
			);
		},
		[toast],
	);

	return { userLocation, isLocating, locate };
}
