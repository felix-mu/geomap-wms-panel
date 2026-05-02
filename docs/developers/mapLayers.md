# Map layers
## Apply new map layer options
Typically new layer options are defined in the `ExtendMapLayerOptions` interface in the [`extensions.ts`](../../src/extension.ts) module. \
> ⚠️ These options are generic and apply to all openlayers layer types. \
> Layer options which are specific to subtypes of map layers, e.g. WMS layer or WMTS layers, should be defined in the respective module and are handled there by evaluating the `config?: TConfig;` property of the `ExtendMapLayerOptions`.

```typescript
export interface ExtendMapLayerOptions<TConfig = any> {
  type: string;
  name?: string;
  config?: TConfig;
  location?: ExtendFrameGeometrySource;
  opacity?: number;
  query?: MatcherConfig;
  displayProperties?: string[];
  titleField?: string;
  timeField?: string;
  visible?: boolean;
  enabledForDataLinks?: boolean;
  basemapUsedAsMapLayer?: boolean;
  minZoom?: number;
  maxZoom?: number;
}
```

To apply these options to the layer instance at the time of adding it to the map instance it is recommended to extend the `initLayer` function of the [`GeomapPanel.tsx`](../../src/GeomapPanel.tsx) module. \
The high-level options are contained by the `overlay` object which represents a layer object of type `ExtendMapLayerOptions`.

### Example
#### Extending the `ExtendMapLayerOptions` with the an options that sets the default visibility of a layer.
1. Add a boolean flag `visible` to the `ExtendMapLayerOptions` interface:
```typescript
export interface ExtendMapLayerOptions<TConfig = any> {
  type: string;
  name?: string;
  config?: TConfig;
  location?: ExtendFrameGeometrySource;
  opacity?: number;
  query?: MatcherConfig;
  displayProperties?: string[];
  titleField?: string;
  timeField?: string;
  visible?: boolean;
  enabledForDataLinks?: boolean;
  basemapUsedAsMapLayer?: boolean;
  minZoom?: number;
  maxZoom?: number;
}
```

2. Extend the editor builder of [`LayerEditor.tsx`](../../src/editor/LayerEditor.tsx) with the `visible` property
> See official docs for how to add panel properties: https://grafana.com/developers/plugin-tools/tutorials/build-a-panel-plugin
```typescript
builder.addBooleanSwitch({
path: 'visible',
name: 'Layer is selected by default in the layer switch control',
description: 'If toggled the layer is selected by default in the layer switch control. Uncheck to have the layer invisible by default.',
settings: {},
defaultValue: true
});
```

3. Extend the `context` object of [`LayerEditor.tsx`](../../src/editor/LayerEditor.tsx) with the `visible` property
```typescript
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
```

4. Extend the `initLayer` function to set the default visbility of a map layer
```typescript
      // Set visible to false if toggle is not set to make layer not selected in switch layer control
      if (overlay.visible !== undefined && overlay.visible === false) {
        layer.setVisible(false)
      }
```