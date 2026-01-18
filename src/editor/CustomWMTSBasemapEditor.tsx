import React, { useEffect, useRef, useState, useId, useContext } from 'react';
import { StandardEditorProps, SelectableValue } from '@grafana/data';
import {
  Combobox,
  ComboboxOption,
  Field,
  Input,
  Label,
  Slider,
  Switch,
} from '@grafana/ui';

import { WMTSConfig } from 'layers/basemaps/wmts';
import {
  getWMTSCapabilitiesFromService,
  getWMTSLayers,
} from 'mapServiceHandlers/wmts';
import { ReducedWMTSEditorContext } from './reducedEditorContext';

type Props = StandardEditorProps<WMTSConfig>;

export const CustomWMTSBasemapEditor = ({ value, onChange }: Props) => {
  const { hideShowLegendToggle, hideAttributionsInput } = useContext(ReducedWMTSEditorContext);

  const [url, setUrl] = useState<string>(value?.url ?? '');
  const [attribution, setAttribution] = useState<string>(value?.attribution ?? '');
  const [opacity, setOpacity] = useState<number>(value?.opacity ?? 1);
  const [showLegend, setShowLegend] = useState<boolean>(value?.showLegend ?? false);

  const [options, setOptions] = useState<Array<SelectableValue<string>>>([]);
  const [selection, setSelection] = useState<SelectableValue<string> | null>(
    value?.layer
      ? { label: value.layer.title, value: value.layer.identifier }
      : null
  );

  // Cache WMTS capabilities per URL
  const cacheRef = useRef<Record<string, Array<SelectableValue<string>>>>({});

  const emitChange = () => {
    // Do NOT emit invalid configs
    if (!url || !selection?.value) {
      return;
    }

    onChange({
      url,
      layer: {
        title: selection.label ?? '',
        identifier: selection.value,
      },
      attribution,
      opacity,
      showLegend,
    });
  };

  useEffect(() => {
    if (!url) {
      new Promise(() => {
        setOptions([]);
        setSelection(null);
      });
      return;
    }

    if (cacheRef.current[url]) {
      new Promise(() => {
        setOptions(cacheRef.current[url]);
      });
      return;
    }

    getWMTSCapabilitiesFromService(url)
      .then((node) => {
        const layers = getWMTSLayers(node);
        cacheRef.current[url] = layers;
        setOptions(layers);
      })
      .catch(() => {
        setOptions([]);
      });
  }, [url]);

  return (
    <div aria-label="wmts-basemap-editor">
      {/* URL */}
      <Label description="URL to WMTS capabilities endpoint (required)">
        URL
      </Label>
      <Input
        value={url}
        aria-label="wmts-url-input"
        onChange={(e) => setUrl(e.currentTarget.value)}
        onBlur={emitChange}
      />

      {/* Layers */}
      <Label description="Select the WMTS layer">
        Layers
      </Label>
      <Combobox
        aria-label="wmts-layer-select"
        options={options as Array<ComboboxOption<string>>}
        value={selection as ComboboxOption<string>}
        onChange={(v) => {
          setSelection(v);
          // emitChange();
          onChange({
            url,
            layer: {
              title: v.label ?? '',
              identifier: v.value ?? '',
            },
            attribution,
            opacity,
            showLegend,
          });
        }}
      />

      {/* Opacity */}
      <Field label="Opacity">
        <Slider
          value={opacity}
          min={0}
          max={1}
          step={0.1}
          onChange={(v) => setOpacity(v ?? 1.0)}
          onAfterChange={emitChange} inputId={useId()}
        />
      </Field>

      {/* Show legend */}
      {
        !hideShowLegendToggle && 
        <Field label="Show legend" description="Show this basemap in the legend">
          <Switch
            value={showLegend}
            onChange={(e) => {
              setShowLegend(e.currentTarget.checked);
              onChange({
                url: url,
                layer: {
                  title: selection!.label ?? '',
                  identifier: selection!.value ?? '',
                },
                attribution: attribution,
                opacity: opacity,
                showLegend: e.currentTarget.checked
              });
            }}
          />
        </Field>
      }

      {/* Attribution */}
      {
        !hideAttributionsInput && 
        <Field label="Attribution (optional)">
          <Input
            value={attribution}
            aria-label="wmts-attribution-input"
            onChange={(e) => setAttribution(e.currentTarget.value)}
            onBlur={emitChange}
          />
        </Field>
      }
    </div>
  );
};
