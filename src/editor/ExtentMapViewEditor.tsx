import { Button, Input, Label, Stack } from "@grafana/ui";
import React, { useState } from "react";
import { MapViewConfig } from "types";
import { parseMapViewExtent, getCurrentMapExtent } from "./extentMapViewEditorUtils";

export function ExtentMapViewEditor({value, onChange}: {value: MapViewConfig, onChange: (value?: MapViewConfig | undefined) => void}) {
    const [extentString, setExtentString] = useState(value?.mapViewExtent ? value.mapViewExtent.toString() : "");
    return (
        <>
            <Label description="A sequence of numbers representing an extent in Spherical Mercator projection (EPSG:3857): minx, miny, maxx, maxy.">
                Map view extent
            </Label>
            <Input data-testid="map view editor extent map view editor input" value={extentString}
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
                <Button style={{marginTop: "4px"}} fullWidth={true} data-testid="map view editor extent map view button" size="sm" variant="secondary" onClick={() => {
                    let extent: number[];
                    try {
                        extent = getCurrentMapExtent();
                    } catch (error) {
                        extent = [];
                    }
                    setExtentString(extent.toString());
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
