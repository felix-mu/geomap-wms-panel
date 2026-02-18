// import { StandardEditorProps } from "@grafana/data";
import { Button, InlineField, InlineFieldRow, Input, Label } from "@grafana/ui";
import { ExtendMapLayerOptions } from "extension";
import React, { useCallback, useMemo, useState } from "react";
import { getCurrentMapViewZoomLevel, getValidationMessage, isValidZoomLevel, isValidZoomLevelConfiguration } from "./minMaxZoomLevelEditorUtils";

export type MinMaxZoomLevelProps = {
    minZoomLevel: number,
    maxZoomLevel: number
}

export function MinMaxZoomLevelEditor({value, onChange}: {value: ExtendMapLayerOptions, onChange: (options: ExtendMapLayerOptions<any>) => void}) {
    const [minZoom, setMinZoom] = useState(value.minZoom);
    const [maxZoom, setMaxZoom] = useState(value.maxZoom);

    const emitChanges = useCallback((minZoomLevel: number|undefined, maxZoomLevel: number|undefined) => {
        try {
            isValidZoomLevel(minZoomLevel);
            isValidZoomLevel(maxZoomLevel);
            isValidZoomLevelConfiguration(minZoomLevel, maxZoomLevel);

            onChange({
                ...value,
                minZoom: minZoomLevel,
                maxZoom: maxZoomLevel,
            });
            } catch (error) {
                return;
            }
    }, [onChange, value]);

    const minZoomLevelValidationMessage = useMemo(() => {
        return getValidationMessage(() => {
                    isValidZoomLevel(minZoom);
                    isValidZoomLevelConfiguration(minZoom, maxZoom);
                });
    }, [minZoom, maxZoom]);

    const maxZoomLevelValidationMessage = useMemo(() => {
        return getValidationMessage(() => {
                    isValidZoomLevel(maxZoom);
                    isValidZoomLevelConfiguration(minZoom, maxZoom);
                });
    }, [minZoom, maxZoom]);

    return (
        <>
            <Label description="If min or max zoom are set, the layer will only be visible at zoom levels greater than the minZoom and less than or equal to the maxZoom. Note: zooming out decreases the zoom level number, zooming in increases the zoom level number.">Layer min/max zoom level</Label>
            <InlineFieldRow>
                <InlineField label="Min zoom level" invalid={minZoomLevelValidationMessage.length > 0} 
                error={minZoomLevelValidationMessage}>
                    <Input data-testid="minmaxzoomleveleditor min zoom level input" value={minZoom} type="number" placeholder="min zoom level" onChange={
                        (e) => {
                            setMinZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        emitChanges(minZoom, maxZoom);
                    }}/>
                </InlineField>
                <Button size="sm" data-testid="minmaxzoomleveleditor min zoom level button" style={{marginBottom: "8px"}} variant="secondary"
                onClick={() => {
                    const currentZoomLevel = getCurrentMapViewZoomLevel();
                    setMinZoom(currentZoomLevel);
                    emitChanges(currentZoomLevel, maxZoom);
                }}>Set from current map view</Button>
            </InlineFieldRow>
            <InlineFieldRow>
                <InlineField label="Max zoom level" invalid={maxZoomLevelValidationMessage.length > 0} 
                error={maxZoomLevelValidationMessage}>
                    <Input data-testid="minmaxzoomleveleditor max zoom level input" value={maxZoom} type="number" placeholder="max zoom level" onChange={
                        (e) => {
                            setMaxZoom(parseFloat(e.currentTarget.value));
                        }
                    } onBlur={() => {
                        emitChanges(minZoom, maxZoom);
                    }}/>
                </InlineField>
                <Button size="sm" data-testid="minmaxzoomleveleditor max zoom level button" style={{marginBottom: "8px"}} variant="secondary"
                onClick={() => {
                    const currentZoomLevel = getCurrentMapViewZoomLevel();
                    setMaxZoom(currentZoomLevel);
                    emitChanges(minZoom, currentZoomLevel);
                }}>Set from current map view</Button>
            </InlineFieldRow>
        </>
    );
};
