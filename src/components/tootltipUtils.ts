import { Extent } from "ol/extent";
import { toLonLat } from "ol/proj";

export type TooltipStyle = {    
};

export type MapViewExtentLatLon = {
    minLonLat: {
        lon: number;
        lat: number;
    },
    maxLonLat: {
        lon: number;
        lat: number;
    }
};

export function convertMapViewExtent2LonLat(extent: Extent | number[], extentProjection: string): MapViewExtentLatLon {
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

export function computeTooltipStyle(clickPointLonLat: {lon: number, lat: number}, extent: MapViewExtentLatLon): TooltipStyle {
    const horizontalDiff = extent.maxLonLat.lon - extent.minLonLat.lon;
    const verticalDiff = extent.maxLonLat.lat - extent.minLonLat.lat;

    const relativeHorizontalClickPoint = (clickPointLonLat.lon - extent.minLonLat.lon) / horizontalDiff;
    const relativeVerticalClickPoint = (clickPointLonLat.lat - extent.minLonLat.lat) / verticalDiff;

    const y = relativeVerticalClickPoint >= 0.5 ? 
    {top: `${(1.0 - relativeVerticalClickPoint) * 100.0}%`} : {bottom: `${relativeVerticalClickPoint * 100.0}%`};
    const x = relativeHorizontalClickPoint >= 0.5 ? 
    {right: `${(1.0 - relativeHorizontalClickPoint) * 100.0}%`} : {left: `${relativeHorizontalClickPoint * 100.0}%`};

    return (
        {
            ...y,
            ...x,
            position: "fixed"
        }
    );
}
