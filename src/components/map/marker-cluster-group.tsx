"use client";

import { createPathComponent, extendContext } from "@react-leaflet/core";
import L from "leaflet";
import type React from "react";
import "leaflet.markercluster";

export interface MarkerClusterGroupProps extends L.MarkerClusterGroupOptions {
	children?: React.ReactNode;
}

export const MarkerClusterGroup = createPathComponent<
	L.MarkerClusterGroup,
	MarkerClusterGroupProps
>((props, context) => {
	const clusterGroup = L.markerClusterGroup(props);
	return {
		instance: clusterGroup,
		context: extendContext(context, { layerContainer: clusterGroup }),
	};
});
