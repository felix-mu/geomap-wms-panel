import Map from 'ol/Map';

import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
// import {
//   PanelOptionsEditorBuilder, //FieldOverrideContext,
// // PanelOptionsEditorBuilder,
// } from '@grafana/data';
// import { MultipleWMSEditor } from 'editor/MultipleWMSEditor';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import { getWMTSCapabilitiesFromService,/*, getProjection, buildWMSGetLegendURL*/ 
getWMTSLegendURLForLayer} from 'mapServiceHandlers/wmts';
import { WMSLegend } from 'mapcontrols/WMSLegend';
import TileLayer from 'ol/layer/Tile';
import { WMTS } from 'ol/source';
import { Options, optionsFromCapabilities } from 'ol/source/WMTS';
import { CustomWMTSBasemapEditor } from 'editor/CustomWMTSBasemapEditor';

// import {
  // RefreshEvent,
  // RefreshEvent,
  // getAppEvents
  // } from '@grafana/runtime';


// Constants
// Since the constants are global they should be set each time the panel is accessed
// let optionsBuilder: PanelOptionsEditorBuilder<ExtendMapLayerOptions>;
type WMTSTuple = {
  title: string,
  identifier: string
}

export type LegendItem = {
  label: string,
  url: string
}

export interface WMTSConfig {
    // [x: string]: {};
    url: string,
    layer: WMTSTuple,
    opacity: number,
    attribution: string,
    showLegend: boolean
}

export interface WMTSBaselayerConfig {
  // wmtsBaselayer: WMTSConfig[],
  wmtsBaselayer: WMTSConfig
  // attribution: string,
}

export const wmts: ExtendMapLayerRegistryItem<WMTSBaselayerConfig> = {
  id: 'wmts',
  name: 'OGC Web Map Tile Service',
  description: 'Add an OGC Web Map Tile Service',
  isBaseMap: true,

  /**
   * Function that configures transformation and returns a transformer
   * @param options
   */
  create: async (map: Map, options: ExtendMapLayerOptions<WMTSBaselayerConfig>) => {
    // Remove previous legend control if it exists
    // WMTSLegend.removeWMTSLegendControlFromMap(map);

    let layers: BaseLayer[] = [];
    let legendItems: LegendItem[] = [];
    const cfg = { ...options.config };

    if (cfg.wmtsBaselayer) {
      // for (let wmtsItem of cfg.wmtsBaselayer) {
        const wmtsItem = cfg.wmtsBaselayer;

        let wmtsCapabilities: object | undefined;
        let selectedWmtsLayer: WMTSTuple | undefined = undefined;
        let wmtsOptions: Options | null = null;
    
        // Set selectedWmsLayer to empty array if accessed in edit mode for the first time
        selectedWmtsLayer = !wmtsItem || ((wmtsItem.layer as unknown) as string) === "" ? undefined : wmtsItem.layer;

        if (selectedWmtsLayer) {
          // This happens in edit mode when the WMS url changes
          // This will fail if the panel is opened in edit mode for the first time
          try {
            wmtsCapabilities = await getWMTSCapabilitiesFromService(wmtsItem.url as string);
            wmtsOptions = optionsFromCapabilities(wmtsCapabilities, {"layer": selectedWmtsLayer.identifier, "crossOrigin": "anonymous"});
          } catch (error) {
            // continue;
          }

          // if (!wmtsOptions) {
          //   continue;
          // }

          if (wmtsOptions) {
            const wmtsSource = new WMTS(wmtsOptions!);
            layers.push(
              new TileLayer({
                source: wmtsSource,
                opacity: wmtsItem.opacity ? wmtsItem.opacity : 1.0
              })
            );
  
            if (wmtsItem.showLegend){
              let wmtsLegendURL;
              try {
                wmtsLegendURL = getWMTSLegendURLForLayer(wmtsCapabilities, selectedWmtsLayer.identifier);
              } catch (error) {
                wmtsLegendURL = "";
              }
              legendItems.push(
                {
                  label: selectedWmtsLayer.title,
                  url: wmtsLegendURL
                }
              );
            }
          }
        }
      // }
    }

    if (legendItems.length > 0) {
      map.addControl(new WMSLegend(legendItems));
    }

    return ({
        init: () => {
          return new LayerGroup({
            layers: [
              ...layers
            ]
          });
        }
      })
  },
	
	registerOptionsUI: async (builder) => {
    builder
    .addCustomEditor(
      {
        id: 'wmts-layers',
        // name: 'URL',
        name: 'WMTS',
        path: 'config.wmtsBaselayer',
        // description: 'URL to WMS endpoint (required)',
        // description: 'WMS',
        editor: CustomWMTSBasemapEditor
        // editor: MultipleWMTSEditor,
      }
    );
    // .addTextInput({
    //   path: 'config.attribution',
    //   name: 'Attribution (optional)'
    // });

      // optionsBuilder = builder;
    },
};

export const wmtsLayers = [wmts];
