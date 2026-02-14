// import { StandardEditorProps } from "@grafana/data";
import { Button, InlineField, InlineFieldRow, Input, Label } from "@grafana/ui";
import { ExtendMapLayerOptions } from "extension";
import React, { useState } from "react";

export type MinMaxZoomLevelProps = {
    minZoomLevel: number,
    maxZoomLevel: number
}

export function MinMaxZoomLevelEditor({value, onChange}: {value: ExtendMapLayerOptions, onChange: (options: ExtendMapLayerOptions<any>) => void}) {
    const [minZoom, setMinZoom] = useState(value.minZoom ?? "");
    const [maxZoom, setMaxZoom] = useState(value.maxZoom ?? "");
    return (
        <>
            <Label description="If min or max zoom are set, the layer will only be visible at zoom levels greater than the minZoom and less than or equal to the maxZoom.">Layer min/max zoom level</Label>
            <InlineFieldRow>
                <InlineField label="Min zoom level" invalid={(minZoom >= maxZoom && minZoom !== "" && maxZoom !== "") || parseFloat(minZoom as string) < 0} 
                error={(minZoom >= maxZoom && minZoom !== "" && maxZoom !== "") || parseFloat(minZoom as string) < 0 ? "min zoom level must be smaller than max zoom level and greather than zero": ""}>
                    <Input value={minZoom} type="number" placeholder="min zoom level" onChange={
                        (e) => {
                            setMinZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoom >= maxZoom || parseFloat(minZoom as string) < 0) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button size="sm" data-testid="minmaxzoomleveleditor min zoom level button" style={{marginBottom: "8px"}} variant="secondary">Set from current map view</Button>
            </InlineFieldRow>
            <InlineFieldRow>
                <InlineField label="Max zoom level" invalid={(minZoom >= maxZoom && minZoom !== "" && maxZoom !== "") || parseFloat(maxZoom as string) < 0} 
                error={(minZoom >= maxZoom && minZoom !== "" && maxZoom !== "") || parseFloat(maxZoom as string) < 0 ? "max zoom level must be greater than min zoom level and greater than zero": ""}>
                    <Input value={maxZoom} type="number" placeholder="max zoom level" onChange={
                        (e) => {
                            setMaxZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoom >= maxZoom || parseFloat(minZoom as string) < 0) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button size="sm" data-testid="minmaxzoomleveleditor max zoom level button" style={{marginBottom: "8px"}} variant="secondary">Set from current map view</Button>
            </InlineFieldRow>
        </>
    );
};
