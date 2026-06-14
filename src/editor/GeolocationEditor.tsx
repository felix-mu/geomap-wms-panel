import { StandardEditorProps } from "@grafana/data";
import { GeolocationConfig } from "types";
import { Input, Label, Switch } from '@grafana/ui';
import React, { useState } from "react";

export function GeolocationEditor({ value, onChange, context }: StandardEditorProps<GeolocationConfig>) {
    const [refreshInterval, setRefreshInterval] = useState(value.refreshInterval ?? "");
    const [enabled, setEnabled] = useState(value.enabled ?? false);

    return (
        <>
            <Label description="Enable geolocation of device. Leave refresh interval empty to disable auto-refresh of geolocation.">
                Enable geolocation of device for on map
            </Label>
            <Switch value={enabled}
                onChange={(e) => {
                    setEnabled(e.currentTarget.checked)
                    onChange({
                        refreshInterval: refreshInterval,
                        enabled: e.currentTarget.checked
                    });

                }}
            ></Switch>
            <Input data-testid="geolocation editor refresh interval input"
                type="number" placeholder="Geolocation update interval in seconds"
                value={refreshInterval}
                onChange={e => {
                    setRefreshInterval(Number(e.currentTarget.value));
                }}
                onBlur={e => onChange({
                    refreshInterval: Number(e.currentTarget.value),
                    enabled: enabled
                })}
            ></Input>
        </>
    )
}