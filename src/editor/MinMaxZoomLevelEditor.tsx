import { Button, InlineField, InlineFieldRow, Input } from "@grafana/ui";
import React, { useState } from "react";

export type MinMaxZoomLevelProps = {
    minZoomLevel: number,
    maxZoomLevel: number
}

export function MinMaxZoomLevelEditor({minZoomLevel, maxZoomLevel}: MinMaxZoomLevelProps, onChange: any) {
    const [minZoom, setMinZoom] = useState(minZoomLevel ?? "");
    const [maxZoom, setMaxZoom] = useState(maxZoomLevel ?? "");
    return (
        <>
            <InlineFieldRow>
                <InlineField label="Min zoom level" invalid={minZoomLevel >= maxZoomLevel} 
                error={minZoomLevel >= maxZoomLevel ? "min zoom level must be smaller than max zoom level": ""}>
                    <Input value={minZoom} type="number" placeholder="min zoom level" onChange={
                        (e) => {
                            setMinZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoomLevel >= maxZoomLevel) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button>Set from current map view</Button>

                <InlineField label="Max zoom level" invalid={minZoomLevel >= maxZoomLevel} 
                error={minZoomLevel >= maxZoomLevel ? "min zoom level must be smaler than max zoom level": ""}>
                    <Input value={maxZoom} type="number" placeholder="max zoom level" onChange={
                        (e) => {
                            setMaxZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        if (minZoomLevel >= maxZoomLevel) {
                            return;
                        }
                    }}/>
                </InlineField>
                <Button>Set from current map view</Button>
            </InlineFieldRow>
        </>
    );
};
