// import { css } from "@emotion/css";
import { SelectableValue } from "@grafana/data";
import { ComboboxOption, Field, Input, Label, MultiCombobox, Slider, Switch, /*useStyles2*/ } from "@grafana/ui";
import { WMSConfig } from "layers/basemaps/wms";
import { getWMSCapabilitiesFromService, getWMSLayers } from "mapServiceHandlers/wms";
import React, { useId, useRef, useState } from "react";

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

type Props = {
  onChange: any,
  wms: WMSConfig,
  cache: {
    current: { [url: string]: Array<SelectableValue<string>> }
  },
  hideShowLegendToggle?: boolean,
  hideAttributionInput?: boolean
};

// export const CustomWMSBasemapLayersEditor = ({ item, value, onChange }: Props/*StandardEditorProps<string>*/) => {

  // const options: Array<SelectableValue<string>> = [];

export const CustomWMSBasemapEditor = ({ onChange, wms, cache, hideShowLegendToggle = false, hideAttributionInput = false}: Props) => {
  const [url, setURL] = useState<string>(wms === undefined || 
    wms.url === undefined ? "" : wms.url);
  const [attribution, setAttribution] = useState<string>(wms === undefined || 
    wms.attribution === undefined ? "" : wms.attribution);
  const opacityRef = useRef<number>(wms === undefined || 
    wms.opacity === undefined ? 1.0 : wms.opacity);
  const [options, setOptions] = useState<Array<SelectableValue<string>>>([]);  // SelectableValue
  const [selection, setSelection] = useState<Array<SelectableValue<string>>>([]);

  const updateLayerSelectionOptions = () => {
    function handleLayers(layers: Array<SelectableValue<string>>) {
      setOptions(layers);

      // If layers are provided because of a repeating entry in edit mode while editing or after refresh
      // set the selection to show the user the current layer selection
      if (wms && wms.layers) {
        let selection_tmp: Array<SelectableValue<string>> = [];
        
        // Generate selection from the available options by comparing the value keys with the layer names of the config
        wms.layers.forEach(
          (el) => {
            selection_tmp = selection_tmp.concat(
              // User layers since options are update in next render and therefore might be empty
              layers.filter((currentValue) => {
                return currentValue.value === el.name;
              })
            );
          }
        );
        setSelection(selection_tmp);
      } 
    }
  
    if (cache.current[url]) {
      handleLayers(cache.current[url]);
    } else {
      getWMSCapabilitiesFromService(url).then(async (node) => {
        let layers = getWMSLayers(node);
        cache.current[url] = layers;
        handleLayers(layers);
      }).catch(err => {});
    }
  };
  // Update the select options when the url changes
  // useEffect(() => {
  //   function handleLayers(layers: Array<SelectableValue<string>>) {
  //     setOptions(layers);

  //     // If layers are provided because of a repeating entry in edit mode while editing or after refresh
  //     // set the selection to show the user the current layer selection
  //     if (wms && wms.layers) {
  //       let selection_tmp: Array<SelectableValue<string>> = [];
        
  //       // Generate selection from the available options by comparing the value keys with the layer names of the config
  //       wms.layers.forEach(
  //         (el) => {
  //           selection_tmp = selection_tmp.concat(
  //             // User layers since options are update in next render and therefore might be empty
  //             layers.filter((currentValue) => {
  //               return currentValue.value === el.name;
  //             })
  //           );
  //         }
  //       );
  //       setSelection(selection_tmp);
  //     } 
  //   }
    
  //   if (cache.current[url]) {
  //     handleLayers(cache.current[url]);
  //   } else {
  //     getWMSCapabilitiesFromService(url).then(async (node) => {
  //       let layers = getWMSLayers(node);
  //       cache.current[url] = layers;
  //       handleLayers(layers);
  //     }).catch(err => {});
  //   }
  // }, [url, wms, cache]);

  // <label className={styles.svg}>My select</label>
  // https://github.com/grafana/grafana/blob/ef5d71711a523efc65da089d45083e28201b58ab/packages/grafana-ui/src/components/Forms/Label.tsx
  return (
    <div aria-label="wms container">
      <Label description={'URL to WMS endpoint (required)'}>
        URL
      </Label>
      <Input value={url} aria-label="URL input"
          onChange={e => {
            setURL(e.currentTarget.value);
            // url.current = e.currentTarget.value;
            // if (wms) {
            //   wms.layers.splice(-1);
            // }
            setOptions([]);
            setSelection([]);
            }} 
          onBlur={(e) => {
              // if (url === wms.url) {
              //   return;
              // }
              // onChange({url: url, layers: selection.map((e) => ({title: e.label!, name: e.value!})), attribution: attribution, opacity: wms.opacity, showLegend: wms.showLegend});
              updateLayerSelectionOptions();
            }}></Input>
      <Label description={'Select the layers to be displayed in base map'}>
        Layers
      </Label>
      <MultiCombobox aria-label="wms layer multiselect" options={options as Array<ComboboxOption<string>>} value={selection as Array<ComboboxOption<string>>} onChange={(selectableValue) => {
        setSelection(selectableValue);
        onChange({url: url, layers: selectableValue.map((e) => ({title: e.label!, name: e.value!})), attribution: attribution, opacity: wms.opacity, showLegend: wms.showLegend}); // onChange sets the config.wms property; Only change it when layers are selected
        }}></MultiCombobox>
      <Field label="Opacity" aria-label="wms opacity slider">
        <Slider value={wms.opacity} step={0.1} min={0} max={1} onAfterChange={(val) => {
          onChange({ url: url, layers: selection.map((e) => ({ title: e.label!, name: e.value! })), attribution: attribution, opacity: val, showLegend: wms.showLegend });
        } } onChange={(val) => { opacityRef.current = val; } } inputId={useId()}></Slider>
      </Field>
      {
        !hideShowLegendToggle && 
        <Field label="Show legend" description="Toggle to show layers in legend" aria-label="wms layer legend toggle switch">
          <Switch value={(wms.showLegend || false)} onChange={(e) => {
            onChange({url: url, layers: selection.map((e) => ({title: e.label!, name: e.value!})), attribution: attribution, opacity: wms.opacity, showLegend: !wms.showLegend})
          }
          }/>
        </Field>
      }
      {
        !hideAttributionInput && 
        <Field label="Attribution (optional)" /*description="This information is very important, so you really need to fill it in"*/>
          <Input value={attribution} aria-label="attribution input" onChange={e => {
            setAttribution(e.currentTarget.value);
          }} onBlur={() => onChange({url: url, layers: selection.map((e) => ({title: e.label!, name: e.value!})), attribution: attribution, opacity: opacityRef.current, showLegend: wms.showLegend})}></Input>
        </Field>
      }
    </div>
        )
};

