import { StandardEditorProps } from "@grafana/data";
import { Button, InlineField, InlineFieldRow, Input } from "@grafana/ui";
import React, { useState } from "react";

export type MinMaxZoomLevelProps = {
    minZoomLevel: number,
    maxZoomLevel: number
}

export function MinMaxZoomLevelEditor({value, onChange}: StandardEditorProps<MinMaxZoomLevelProps>) {
    const [minZoom, setMinZoom] = useState(value.minZoomLevel ?? "");
    const [maxZoom, setMaxZoom] = useState(value.maxZoomLevel ?? "");
    return (
        <>
            <InlineFieldRow>
                <InlineField label="Min zoom level" invalid={minZoom >= maxZoom} 
                error={minZoom >= maxZoom ? "min zoom level must be smaller than max zoom level": ""}>
                    <Input value={minZoom} type="number" placeholder="min zoom level" onChange={
                        (e) => {
                            setMinZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoom >= maxZoom) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button>Set from current map view</Button>
            </InlineFieldRow>
            <InlineFieldRow>
                <InlineField label="Max zoom level" invalid={minZoom >= maxZoom} 
                error={minZoom >= maxZoom ? "min zoom level must be smaler than max zoom level": ""}>
                    <Input value={maxZoom} type="number" placeholder="max zoom level" onChange={
                        (e) => {
                            setMaxZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoom >= maxZoom) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button>Set from current map view</Button>
            </InlineFieldRow>
        </>
    );
};
