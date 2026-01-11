import React, { FC, useMemo } from 'react';
import { Combobox, ComboboxOption, ScrollContainer } from '@grafana/ui';
import {
  DataFrame,
  PanelOptionsEditorBuilder,
  StandardEditorContext,
  FieldOverrideContext,
  getFieldDisplayName,
  FieldType,
  Field,
} from '@grafana/data';
import { DEFAULT_BASEMAP_CONFIG, geomapLayerRegistry } from '../layers/registry';
import { OptionsPaneCategoryDescriptor } from './PanelEditor/OptionsPaneCategoryDescriptor';
import { setOptionImmutably } from './PanelEditor/utils';
import { fillOptionsPaneItems } from './PanelEditor/getVizualizationOptions';
import { GazetteerPathEditor } from './GazetteerPathEditor';
import { ExtendMapLayerRegistryItem, ExtendMapLayerOptions, ExtendFrameGeometrySourceMode } from '../extension';
import { FrameSelectionEditor } from './FrameSelectionEditor';

export interface LayerEditorProps<TConfig = any> {
  options?: ExtendMapLayerOptions<TConfig>;
  data: DataFrame[]; // All results
  onChange: (options: ExtendMapLayerOptions<TConfig>) => void;
  filter: (item: ExtendMapLayerRegistryItem) => boolean;
  showNameField?: boolean; // Show the name field in the options
  isBaselayerEditor?: boolean;
}

export const LayerEditor: FC<LayerEditorProps> = ({ options, onChange, data, filter, showNameField, isBaselayerEditor = false }) => {
  // all basemaps
  const layerTypes = useMemo(() => {
    return geomapLayerRegistry.selectOptions(
      options?.type // the selected value
        ? [options.type] // as an array
        : [DEFAULT_BASEMAP_CONFIG.type],
      filter
    );
  }, [options, filter]);

  // The options change with each layer type
  const optionsEditorBuilder = useMemo(() => {
    const layer = geomapLayerRegistry.getIfExists(options?.type);
    if (!layer || !(layer.registerOptionsUI || layer.showLocation || layer.showOpacity)) {
      return null;
    }

    const builder = new PanelOptionsEditorBuilder<ExtendMapLayerOptions>();

    if (showNameField) {
      builder.addTextInput({
        path: 'name',
        name: 'Name',
        description: 'Layer name',
        settings: {},
        defaultValue: 'unnamed layer'
      });
    }

    if (layer.showLocation) {
      builder
        .addCustomEditor({
          id: 'query',
          path: 'query',
          name: 'Query',
          editor: FrameSelectionEditor,
          defaultValue: undefined,
        })
        .addRadio({
          path: 'location.mode',
          name: 'Location',
          description: '',
          defaultValue: ExtendFrameGeometrySourceMode.Auto,
          settings: {
            options: [
              { value: ExtendFrameGeometrySourceMode.Auto, label: 'Auto' },
              { value: ExtendFrameGeometrySourceMode.Coords, label: 'Coords' },
              { value: ExtendFrameGeometrySourceMode.Geohash, label: 'Geohash' },
              { value: ExtendFrameGeometrySourceMode.Lookup, label: 'Lookup' },
              { value: ExtendFrameGeometrySourceMode.Geojson, label: 'Geojson' },
            ],
          },
        })
        .addFieldNamePicker({
          path: 'location.geojson',
          name: 'Geojson field',
          // settings: {
          //   filter: (f: Field) => f.type === FieldType.other,
          //   noFieldsMessage: 'No strings fields found',
          // },
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Geojson,
        })
        .addFieldNamePicker({
          path: 'location.latitude',
          name: 'Latitude field',
          settings: {
            filter: (f: Field) => f.type === FieldType.number,
            noFieldsMessage: 'No numeric fields found',
          },
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Coords,
        })
        .addFieldNamePicker({
          path: 'location.longitude',
          name: 'Longitude field',
          settings: {
            filter: (f: Field) => f.type === FieldType.number,
            noFieldsMessage: 'No numeric fields found',
          },
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Coords,
        })
        .addFieldNamePicker({
          path: 'location.geohash',
          name: 'Geohash field',
          settings: {
            filter: (f: Field) => f.type === FieldType.string,
            noFieldsMessage: 'No strings fields found',
          },
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Geohash,
        })
        .addFieldNamePicker({
          path: 'location.lookup',
          name: 'Lookup field',
          settings: {
            filter: (f: Field) => f.type === FieldType.string,
            noFieldsMessage: 'No strings fields found',
          },
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Lookup,
        })
        .addCustomEditor({
          id: 'gazetteer',
          path: 'location.gazetteer',
          name: 'Gazetteer',
          editor: GazetteerPathEditor,
          showIf: (opts) => opts.location?.mode === ExtendFrameGeometrySourceMode.Lookup,
        })
        .addFieldNamePicker({
          path: 'titleField',
          name: 'Pop up title',
          settings: {
            filter: (f: Field) => f.type === FieldType.string,
            noFieldsMessage: 'No string fields found',
          },
        })
        .addFieldNamePicker({
          path: 'timeField',
          name: 'Pop up Time',
          settings: {
            filter: (f: Field) => f.type === FieldType.time,
            noFieldsMessage: 'No time fields found',
          },
        })
        .addMultiSelect({
          path: 'displayProperties',
          name: 'Properties',
          description: 'Select properties to be displayed',
          settings: {
            allowCustomValue: false,
            options: [],
            // placeholder: 'All Properties',
            getOptions: async (context: FieldOverrideContext) => {
              const options = [];
              if (context && context.data && context.data.length > 0 && context.options && context.options.query && context.options.query.options) {
                const frames = context.data;
                for (let i = 0; i < frames.length; i++) {
                  if (frames[i].refId && frames[i].refId === context.options.query.options) {
                    const frame = context.data[i];
                    for (const field of frame.fields) {
                      const name = getFieldDisplayName(field, frame, context.data);
                      const value = field.name;
                      options.push({ value, label: name } as any);
                    }
                  }
                }
              }
              else if (context && context.data && context.data.length > 0 && context.data[0].meta) {
                const frames = context.data;
                for (let i = 0; i < frames.length; i++) {
                  const frame = context.data[i];
                  for (const field of frame.fields) {
                    const name = getFieldDisplayName(field, frame, context.data);
                    const value = field.name;
                    options.push({ value, label: name } as any);
                  }
                }
              }
              return options;
            },
          },
          //showIf: (opts) => typeof opts.query !== 'undefined',
          defaultValue: '',
        })
        /*.addBooleanSwitch({
          path: 'tooltip',
          name: 'Display tooltip',
          description: 'Show the tooltip for layer',
          defaultValue: true,
        })*/;
    }

    if (layer.showOpacity) {
      builder.addSliderInput({
        path: 'opacity',
        name: 'Opacity',
        settings: {
          min: 0,
          max: 1,
          step: 0.1,
        },
        defaultValue: 1,
      });
    }

    if (!isBaselayerEditor) {
      builder.addBooleanSwitch({
        path: 'visible',
        name: 'Layer is selected by default in the layer switch control',
        description: 'If toggled the layer is selected by default in the layer switch control. Uncheck to have the layer invisible by default.',
        settings: {},
        defaultValue: true
      });
      if (!layer.isBaseMap) {
        builder.addBooleanSwitch({
          path: 'enabledForDataLinks',
          name: 'Toggle to include the data layer for data links',
          description: 'If toggled the layer is used to interpolate the data links URL.',
          settings: {},
          defaultValue: true
        });
      }
    }

    if (layer.registerOptionsUI) {
      layer.registerOptionsUI(builder);
    }

    return builder;
  }, [options?.type, showNameField, isBaselayerEditor]);

  // The react components
  const layerOptions = useMemo(() => {
    const layer = geomapLayerRegistry.getIfExists(options?.type);
    if (!optionsEditorBuilder || !layer) {
      return null;
    }

    const category = new OptionsPaneCategoryDescriptor({
      id: 'Layer config',
      title: 'Layer config',
    });

    const context: StandardEditorContext<any> = {
      data,
      // options: options,
      options: {
        ...options, 
        opacity: options?.opacity === undefined && layer.showOpacity ? 1.0 : options?.opacity,
        visible: options?.visible === undefined ? true : options?.visible,
        enabledForDataLinks: options?.enabledForDataLinks === undefined ? true : options?.enabledForDataLinks,
      }
    };

    const currentOptions = { /*...options*/...context.options, type: layer.id, config: { ...layer.defaultOptions, ...options?.config } };

    // Update the panel options if not set
    if (!options || (layer.defaultOptions && !options.config)) {
      onChange(currentOptions as any);
    }

    const reg = optionsEditorBuilder.getRegistry();

    // Load the options into categories
    fillOptionsPaneItems(
      reg.list(),

      // Always use the same category
      (categoryNames) => category,

      // Custom upate function
      (path: string, value: any) => {
        onChange(setOptionImmutably(currentOptions, path, value) as any);
      },
      context
    );

    return (
      <>
        <br />
        {category.items.map((item) => item.render())}
      </>
    );
  }, [optionsEditorBuilder, onChange, data, options]);

  return (
    <ScrollContainer>
      <Combobox
        // menuShouldPortal
        options={layerTypes.options as Array<ComboboxOption<string>>}
        value={layerTypes.current[0] as ComboboxOption<string>}
        onChange={(v) => {
          const layer = geomapLayerRegistry.getIfExists(v.value);
          if (!layer) {
            // console.warn('layer does not exist', v);
            return;
          }

          onChange({
            ...options, // keep current options
            type: layer.id,
            config: { ...layer.defaultOptions }, // clone?
          });
        }}
      />

      {layerOptions}
    </ScrollContainer>
  );
};
