import { lastGeomapPanelInstance } from "GeomapPanel";

export const MAX_ZOOM_LEVEL = 28;
export const MIN_ZOOM_LEVEL = 0;

export function isValidZoomLevel(zoomLevel?: number): boolean {
    if (!zoomLevel) { // undefined zoomLevels are also allowed, see: https://openlayers.org/en/latest/apidoc/module-ol_layer_Base-BaseLayer.html
        return true;
    }

    const valid = zoomLevel >= MIN_ZOOM_LEVEL && zoomLevel <= MAX_ZOOM_LEVEL;

    if (valid) {
        return true;
    }

    throw new Error(`zoom level must be between ${MIN_ZOOM_LEVEL} and ${MAX_ZOOM_LEVEL}`);
}

export function isValidZoomLevelConfiguration(minZoom: number | undefined, maxZoom: number | undefined): boolean {
    if (minZoom === undefined && maxZoom === undefined) {
        return true;
    }

    if ((minZoom === undefined && maxZoom !== undefined) || 
        (maxZoom === undefined && minZoom !== undefined)
    ) {
        return true;
    }

    if ((minZoom !== undefined && maxZoom !== undefined) && minZoom <= maxZoom) {
        return true;
    }

    throw new Error("maxZoom must be greater or equal to minZoom");
}

export function getValidationMessage(fn: () => void): string {
    try {
        fn();
    } catch (error) {
        return (error as any).toString();
    }

    return "";
}

export function getCurrentMapViewZoomLevel(): number | undefined {
    return lastGeomapPanelInstance?.map?.getView().getZoom();
}
