// import { css } from "@emotion/css";
import { SelectableValue, StandardEditorProps } from "@grafana/data";
import { Field, Input, Label, Select, Slider, Switch, /*useStyles2*/ } from "@grafana/ui";
import { WMTSConfig } from "layers/basemaps/wmts";
import { getWMTSCapabilitiesFromService, getWMTSLayers } from "mapServiceHandlers/wmts";
import React, { useEffect, useRef, useState } from "react";

// References
// https://github.com/grafana/grafana/blob/9772ed65269f31f846d6daec42f3673903a5171e/packages/grafana-ui/src/components/Select/Select.mdx#L6
// https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/custom-panel-option-editors
// https://community.grafana.com/t/creating-custom-input-types-using-optionsuibuilder/42269/2

// interface Settings {
//   from: number;
//   to: number;
// }

// type ConfigUrlLayer = {
//   url: string | undefined,
//   layers: string[]
// }

// type Props = {
//   onChange: any,
//   wms: WMTSConfig,
//   cache: {
//     current: { [url: string]: Array<SelectableValue<string>> }
//   }
// };

type Props = StandardEditorProps<WMTSConfig>;

export const CustomWMTSBasemapEditor = ({ onChange, value }: Props) => {
  const cacheRef = useRef<{ [url: string]: Array<SelectableValue<string>> }>({});  
  const url = useRef<string>(value === undefined || 
    value.url === undefined ? "" : value.url);
  const [attribution, setAttribution] = useState<string>(value === undefined || 
    value.attribution === undefined ? "" : value.attribution);
  const opacityRef = useRef<number>(value === undefined || 
    value.opacity === undefined ? 1.0 : value.opacity);
  const showLegendRef = useRef<boolean>(value === undefined || 
    value.showLegend === undefined ? false : value.showLegend);
  const [options, setOptions] = useState<Array<SelectableValue<string>>>([]);  // SelectableValue
  const [selection, setSelection] = useState<SelectableValue<string>>([]);

  function handleLayers(layers: Array<SelectableValue<string>>) {
    setOptions(layers);

    // If layers are provided because of a repeating entry in edit mode while editing or after refresh
    // set the selection to show the user the current layer selection
    if (value && value.layer) {
      let selection_tmp = {};
      layers.forEach((currentValue) => {
          if (currentValue.value === value.layer.identifier) {
            selection_tmp = currentValue;
          }
        });
      setSelection(selection_tmp);
    } 
  }

  // Update the select options when the url changes
  useEffect(() => {
    if (cacheRef.current[url.current]) {
      handleLayers(cacheRef.current[url.current]);
    } else {
      getWMTSCapabilitiesFromService(url.current).then(async (node) => {
        let layers = getWMTSLayers(node);
        cacheRef.current[url.current] = layers;
        handleLayers(layers);
      }).catch(err => {});
    }
    // eslint-disable-next-line
  }, [url.current, value]);

  // <label className={styles.svg}>My select</label>
  // https://github.com/grafana/grafana/blob/ef5d71711a523efc65da089d45083e28201b58ab/packages/grafana-ui/src/components/Forms/Label.tsx
  return (
      <div aria-label="wmts container">
        <Label description={'URL to WMTS capabilities endpoint (required)'}>
          URL
        </Label>
        <Input value={url.current} aria-label="URL input"
            onChange={e => {
              // setURL(e.currentTarget.value);
              url.current = e.currentTarget.value;
              if (value) {
                value.layer = { title: "", identifier: "" };
              }
              setOptions([]);
              setSelection({});
              }} 
            onBlur={(e) => {
                // if (url.current === e.currentTarget.value) {
                //   return;
                // }
                // url.current = e.currentTarget.value;
                onChange({url: url.current, layer: {title: selection.label || "", identifier: selection.value || ""}, attribution: attribution, opacity: opacityRef.current, showLegend: showLegendRef.current});
              }}></Input>
        <Label description={'Select the layer to be displayed in base map'}>
          Layers
        </Label>
        <Select aria-label="wmts layer select" options={options} value={selection} onChange={(selectableValue) => {
          setSelection(selectableValue);
          onChange({url: url.current, layer: {title: selectableValue.label || "", identifier: selectableValue.value || ""}, attribution: attribution, opacity: opacityRef.current, showLegend: showLegendRef.current}); // onChange sets the config.wms property; Only change it when layers are selected
          }}></Select>
        <Field label="Opacity" aria-label="wmts opacity slider">
          <Slider value={opacityRef.current} step={0.1} min={0} max={1} onAfterChange={(val) => {
            onChange({url: url.current, layer: {title: selection.label || "", identifier: selection.value || ""}, attribution: attribution, opacity: val!, showLegend: showLegendRef.current})
          }} onChange={(val) => {opacityRef.current = val}}></Slider>
        </Field>
        <Field label="Show legend" description="Toggle to show layers in legend" aria-label="wmts layer legend toggle switch">
            <Switch value={showLegendRef.current} onChange={(e) => {
              showLegendRef.current = e.currentTarget.checked;
              onChange({url: url.current, layer: {title: selection.label || "", identifier: selection.value || ""}, attribution: attribution, opacity: opacityRef.current, showLegend: showLegendRef.current})
            }
            }/>
          </Field>
        <Field label="Attribution (optional)" /*description="This information is very important, so you really need to fill it in"*/>
          <Input value={attribution} aria-label="attribution input" onChange={e => {
            setAttribution(e.currentTarget.value);
          }} onBlur={() => onChange({url: url.current, layer: {title: selection.label || "", identifier: selection.value || ""}, attribution: attribution, opacity: opacityRef.current, showLegend: showLegendRef.current})}></Input>
        </Field>
      </div>
    )
};

