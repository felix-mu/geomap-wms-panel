import React, { FC, useMemo, useCallback } from 'react';
import { StandardEditorProps, SelectableValue } from '@grafana/data';
import { Button, Combobox, InlineField, InlineFieldRow, ComboboxOption, Stack, Field, Switch } from '@grafana/ui';
import { GeomapPanelOptions, MapViewConfig } from '../types';
import { centerPointRegistry, MapCenterID } from '../view';
import { NumberInput } from '../dimensions/editors/NumberInput';
import { lastGeomapPanelInstance } from '../GeomapPanel';
import { toLonLat } from 'ol/proj';
import { FitMapViewEditor } from './FitMapViewEditor';
import { ExtentMapViewEditor } from './ExtentMapViewEditor';

export const MapViewEditor: FC<StandardEditorProps<MapViewConfig, any, GeomapPanelOptions>> = ({
  value,
  onChange,
  context,
}) => {
  const labelWidth = 10;

  const views = useMemo(() => {
    const ids: string[] = [];
    if (value?.id) {
      ids.push(value.id);
    } else {
      ids.push(centerPointRegistry.list()[0].id);
    }
    return centerPointRegistry.selectOptions(ids);
  }, [value]);

  const onSetCurrentView = useCallback(() => {
    const map = lastGeomapPanelInstance?.map;
    // const map = context.instanceState?.map;
    if (map) {
      const view = map.getView();
      const coords = view.getCenter();
      if (coords) {
        const center = toLonLat(coords, view.getProjection());
        onChange({
          ...value,
          id: MapCenterID.Coordinates,
          lon: +center[0].toFixed(6),
          lat: +center[1].toFixed(6),
          zoom: +view.getZoom()!.toFixed(2),
        });
      }
    }
  }, [value, onChange]);

  const onSelectView = useCallback(
    (selection: SelectableValue<string>) => {
      const v = centerPointRegistry.getIfExists(selection.value);
      if (v && v.id /*!== MapCenterID.Auto*/) {
        onChange({
          ...value,
          id: v.id,
          lat: v.lat ?? value?.lat,
          lon: v.lon ?? value?.lon,
          zoom: v.zoom ?? value?.zoom,
        });
      }
    },
    [value, onChange]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label="View" labelWidth={labelWidth} grow={true}>
          <Combobox options={views.options as Array<ComboboxOption<string>>} value={views.current[0] as ComboboxOption<string>} onChange={onSelectView} />
        </InlineField>
      </InlineFieldRow>
      {value?.id === MapCenterID.Coordinates && (
        <>
          <InlineFieldRow>
            <InlineField label="Latitude" labelWidth={labelWidth} grow={true}>
              <NumberInput
                value={value.lat}
                min={-90}
                max={90}
                step={0.001}
                onChange={(v) => {
                  onChange({ ...value, lat: v });
                }}
              />
            </InlineField>
          </InlineFieldRow>
          <InlineFieldRow>
            <InlineField label="Longitude" labelWidth={labelWidth} grow={true}>
              <NumberInput
                value={value.lon}
                min={-180}
                max={180}
                step={0.001}
                onChange={(v) => {
                  onChange({ ...value, lon: v });
                }}
              />
            </InlineField>
          </InlineFieldRow>
          <InlineFieldRow>
            <InlineField label="Zoom" labelWidth={labelWidth} grow={true}>
              <NumberInput
                value={value?.zoom ?? 1}
                min={1}
                max={18}
                step={0.01}
                onChange={(v) => {
                  onChange({ ...value, zoom: v });
                }}
              />
            </InlineField>
          </InlineFieldRow>
          <Stack direction={'column'}>
            <Button variant="secondary" size="sm" fullWidth onClick={onSetCurrentView}>
              <span>Use current map settings</span>
            </Button>
          </Stack>
        </>
      )}
      {value?.id === MapCenterID.Fit && (
        <FitMapViewEditor value={value} onChange={onChange} context={context} />
      )}
      <Field label="Ignore dashboard refresh" description="Toggle to ignore map view updates on dashboard refresh events" aria-label="map view editor ignore dashboard refresh switch">
        <Switch value={value?.ignoreDashboardRefresh ?? false} onChange={(e) => {
          onChange(
            {...value,
              ignoreDashboardRefresh: e.currentTarget.checked
            }
          )
        }
        }/>
      </Field>
      <ExtentMapViewEditor value={value} onChange={onChange}></ExtentMapViewEditor>
    </>
  );
};
