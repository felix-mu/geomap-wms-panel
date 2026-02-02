import { Button, Input, Label, Stack } from "@grafana/ui";
import { lastGeomapPanelInstance } from "GeomapPanel";
import React, { useState } from "react";
import { MapViewConfig } from "types";

export function parseMapViewExtent(numberArrayString: string): number[] {
    numberArrayString = numberArrayString.trim();
    numberArrayString = numberArrayString.replaceAll(" ", "");
    const coordinates = numberArrayString.split(",");
    
    if (coordinates.length != 4) {
        throw new Error(`Extent bounding box needs 4 coordinates: ${coordinates}`);
    }

    const extent: number[] = coordinates.map((coor) => {
        const c = parseFloat(coor);
        if (isNaN(c)) {
            throw new Error(`Could not parse extent coordinate as number: ${c}`);
        }
        return c;
    });

    return extent;
}

export function getCurrentMapExtent(): number[] {
    const map = lastGeomapPanelInstance?.map;

    return map?.getView().calculateExtent(map.getSize()) as number[];
}

export function ExtentMapViewEditor({value, onChange}: {value: MapViewConfig, onChange: (value?: MapViewConfig | undefined) => void}) {
    const [extentString, setExtentString] = useState("");
    return (
        <>
            <Label description="A sequence of numbers representing an extent in Spherical Mercator projection (EPSG:3857): minx, miny, maxx, maxy.">
                Map view extent
            </Label>
            <Input value={extentString.length > 0 ? extentString : value?.mapViewExtent?.toString()}
                onChange={(e) => setExtentString(e.currentTarget.value)}
                onBlur={(e) => {
                    let extent: number[];
                    try {
                        extent = parseMapViewExtent(e.currentTarget.value);
                    } catch (error) {
                        extent = [];
                    }
                    setExtentString(extent.toString());
                    onChange({
                        ...value,
                        mapViewExtent: extent
                    });
                }}>
            </Input>
            <Stack direction={'column'}>
                <Button style={{marginTop: "4px"}} fullWidth={true} data-testid="map view editor extent map view " size="sm" variant="secondary" onClick={() => {
                    let extent: number[];
                    try {
                        extent = getCurrentMapExtent();
                    } catch (error) {
                        extent = [];
                    }
                    onChange({
                            ...value,
                            mapViewExtent: extent
                        });
                    }
                }>Use current map view as extent</Button>  
            </Stack>
        </>
    );
}
