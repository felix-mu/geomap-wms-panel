// import { css } from "@emotion/css";
import { SelectableValue, StandardEditorProps } from "@grafana/data";
import { Input, Label, MultiSelect, /*useStyles2*/ } from "@grafana/ui";
import { getWMSCapabilitiesFromService, getWMSLayers } from "layers/basemaps/wms";
import React, { useEffect, useState } from "react";

// References
// https://github.com/grafana/grafana/blob/9772ed65269f31f846d6daec42f3673903a5171e/packages/grafana-ui/src/components/Select/Select.mdx#L6
// https://grafana.com/developers/plugin-tools/create-a-plugin/extend-a-plugin/custom-panel-option-editors
// https://community.grafana.com/t/creating-custom-input-types-using-optionsuibuilder/42269/2

// interface Settings {
//   from: number;
//   to: number;
// }

type ConfigUrlLayer = {
  url: string | undefined,
  layers: string[]
}

type Props = StandardEditorProps<ConfigUrlLayer>;

// export const CustomWMSBasemapLayersEditor = ({ item, value, onChange }: Props/*StandardEditorProps<string>*/) => {

  // const options: Array<SelectableValue<string>> = [];

export const CustomWMSBasemapEditor = ({ item, value, onChange, context }: Props) => {
  // const styles = useStyles2(getStyles);
  
  const [url, setURL] = useState<string | undefined>('');
  const [options, setOptions] = useState<Array<SelectableValue<string>>>([]);  // SelectableValue
  const [selection, setSelection] = useState<Array<SelectableValue<string>>>([]);

  // If the panel is accessed after refresh set the URL which triggers the useEffect hook
  if ((context.options.config && context.options.config.wms && context.options.config.wms.url) 
      && url!.length === 0) {
        setURL(context.options.config.wms.url);
  }

  // Update the select options when the url changes
  useEffect(() => {
    try {
      getWMSCapabilitiesFromService(url!).then(async (node) => {
        let layers = getWMSLayers(node);
        setOptions(layers);

        // If layers are provided because of a repeating entry in edit mode while editing or after refresh
        // set the selection to show the user the current layer selection
        if (context.options.config && context.options.config.wms.layers) {
          let selection_tmp: Array<SelectableValue<string>> = [];
          
          // Generate selection from the available options by comparing the value keys with the layer names of the config
          (context.options.config.wms.layers as string[]).forEach(
            (el) => {
              selection_tmp = selection_tmp.concat(
                // User layers since options are update in next render and therefore might be empty
                layers.filter((currentValue) => {
                  return currentValue.value === el;
                })
              );
            }
          );
          setSelection(selection_tmp);
        }
      });
    } catch (error) {

    }
  // eslint-disable-next-line
  }, [url]);

  // <label className={styles.svg}>My select</label>
  // https://github.com/grafana/grafana/blob/ef5d71711a523efc65da089d45083e28201b58ab/packages/grafana-ui/src/components/Forms/Label.tsx
  return (
    <>
      {/* <Label description={'URL to WMS endpoint (required)'}>
        URL
      </Label> */}
      <Input value={url} aria-label="URL input"
          onChange={e => {
            setURL(e.currentTarget.value);
            setOptions([]);
            setSelection([]);
            }}></Input>
      <Label description={'Select the layers to be displayed in base map'}>
        Layers
      </Label>
      <MultiSelect options={options} value={selection} onChange={(selectableValue) => {
        setSelection(selectableValue);
        onChange({url: url, layers: selectableValue.map((e) => e.value!)}); // onChange sets the config.wms property; Only change it when layers are selected
        }}></MultiSelect>
    </>
        )
};

// const getStyles = () => {
//   return {
//     wrapper: css`
//       font-family: Open Sans;
//       position: relative;
//     `,
//     svg: css`
//       position: absolute;
//       top: 0;
//       left: 0;
//     `,
//   };
// };
