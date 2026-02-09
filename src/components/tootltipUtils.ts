import { getFieldDisplayName } from "@grafana/data";
import { GeomapHoverPayload } from "event";
import { Extent } from "ol/extent";
import { toLonLat } from "ol/proj";
import { Size } from "ol/size";

export type TooltipStyle = {    
};

export type MapViewExtentLonLat = {
    minLonLat: {
        lon: number;
        lat: number;
    },
    maxLonLat: {
        lon: number;
        lat: number;
    }
};

export function convertMapViewExtent2LonLat(extent: Extent | number[], extentProjection: string): MapViewExtentLonLat {
    const minLonLat = toLonLat([extent[0], extent[1]], extentProjection);
    const maxLonLat = toLonLat([extent[2], extent[3]], extentProjection);

    return ({
        minLonLat: {
            lon: minLonLat[0],
            lat: minLonLat[1]
        },
        maxLonLat: {
            lon: maxLonLat[0],
            lat: maxLonLat[1]
        },
    });
}

export function computeTooltipStyle(clickPointLonLat: {lon: number, lat: number},
    extent: MapViewExtentLonLat, mapSize: Size): TooltipStyle {
    const horizontalDiff = extent.maxLonLat.lon - extent.minLonLat.lon;
    const verticalDiff = extent.maxLonLat.lat - extent.minLonLat.lat;

    const relativeHorizontalClickPoint = (clickPointLonLat.lon - extent.minLonLat.lon) / horizontalDiff;
    const relativeVerticalClickPoint = (clickPointLonLat.lat - extent.minLonLat.lat) / verticalDiff;

    const y = relativeVerticalClickPoint >= 0.5 ? 
    {top: `${(1.0 - relativeVerticalClickPoint) * 100.0}%`, maxHeight: `${relativeVerticalClickPoint * mapSize[1]}px`} : 
    {bottom: `${relativeVerticalClickPoint * 100.0}%`, maxHeight: `${(1.0 - relativeVerticalClickPoint) * mapSize[1]}px`};

    const x = relativeHorizontalClickPoint >= 0.5 ? 
    {right: `${(1.0 - relativeHorizontalClickPoint) * 100.0}%`, maxWidth: `${relativeHorizontalClickPoint * mapSize[0]}px`} : 
        {left: `${relativeHorizontalClickPoint * 100.0}%`, maxWidth: `${(1.0 - relativeHorizontalClickPoint) * mapSize[0]}px`};

    return (
        {
            ...y,
            ...x,
            position: "fixed",
            scrollbarWidth: "thin",
            overflow: "auto",
        }
    );
}

export function copy2ClipBoardDataAsJSON(hoverEventPayload: GeomapHoverPayload): string {
    const { data, rowIndex, propsToShow } = hoverEventPayload;

    let dataObject: any = {};

    (propsToShow ?? []).forEach((field) => {
        const fieldName = getFieldDisplayName(field, data);
        let fieldValue: any;
        try {
            fieldValue = data?.fields.find((f) => f.name === field.name)?.values[rowIndex!] ?? null;
        } catch (error) {
            fieldValue = null;
        }
        dataObject[fieldName] = fieldValue;
    });

    return JSON.stringify(dataObject);
}
