import Map from 'ol/Map';

import { ExtendMapLayerOptions, ExtendMapLayerRegistryItem } from 'extension';
// import {
//   PanelOptionsEditorBuilder, //FieldOverrideContext,
// // PanelOptionsEditorBuilder,
// } from '@grafana/data';
// import { MultipleWMSEditor } from 'editor/MultipleWMSEditor';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import { addCustomParametersToWMTSOptionsURLs, getWMTSCapabilitiesFromService,/*, getProjection, buildWMSGetLegendURL*/ 
getWMTSLegendURLForLayer, appendCustomQueryParameters,
registerCRSInProj4,
removeQueryParameters} from 'mapServiceHandlers/wmts';
import { LegendItem, WMSLegend } from 'mapcontrols/WMSLegend';
import TileLayer from 'ol/layer/Tile';
import { WMTS } from 'ol/source';
import { Options, optionsFromCapabilities } from 'ol/source/WMTS';
import { CustomWMTSBasemapEditor } from 'editor/CustomWMTSBasemapEditor';
import { lastGeomapPanelInstance } from 'GeomapPanel';

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

export interface WMTSConfig {
    // [x: string]: {};
    url: string,
    layer: WMTSTuple,
    opacity: number,
    attribution: string,
    showLegend: boolean,
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
    // Remove previous legend control if it exists and the layer is used as basemap
    // If the layer is used as map layer do not remove the legend but append the legend entries
    if (!options.basemapUsedAsMapLayer) {
      WMSLegend.removeWMSLegendControlFromMap(map);
    }

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
            await registerCRSInProj4(wmtsCapabilities);
            wmtsOptions = optionsFromCapabilities(wmtsCapabilities, {"layer": selectedWmtsLayer.identifier, "crossOrigin": "anonymous"});
          } catch (error) {
            throw new Error(`Error setting up wmts options for wmts: ${error}`)
          }

          if (wmtsOptions) {
            try {
              wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsItem.url, {...wmtsOptions});
            } catch (error) {
				      throw new Error(`Error updating wmts options with custom query parameters: ${error}`)
            }
            const wmtsSource = new WMTS({...wmtsOptions!, attributions: wmtsItem.attribution ?? ""});
            layers.push(
              new TileLayer({
                source: wmtsSource,
                opacity: wmtsItem.opacity ?? 1.0,
              })
            );
  
            if (wmtsItem.showLegend){
              let wmtsLegendURL;
              try {
                // Append custom query parameters to legend urls
                wmtsLegendURL = getWMTSLegendURLForLayer(wmtsCapabilities, selectedWmtsLayer.identifier);
                wmtsLegendURL = appendCustomQueryParameters(
                    wmtsLegendURL, 
                    removeQueryParameters(new URL(wmtsItem.url).searchParams)
                );
              } catch (error) {
                wmtsLegendURL = wmtsLegendURL ?? "";
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
      if (!options.basemapUsedAsMapLayer || !WMSLegend.getWMSLegendControlFromMap(map!)) {  // If the basemap layer does not provide a WMSLegend a new one has to be created
        map.addControl(new WMSLegend(legendItems, {target: lastGeomapPanelInstance?.mapOverlay}));
      } else {
        // Append legend items if baselayer is used as map layer
        WMSLegend.getWMSLegendControlFromMap(map!)?.addLegendItems(legendItems);
        // INFO: There is no need to remove the items from the WMS legend when the toggle for a baselayer used as map layer is 
        // deactivated because the options change is propgated to the top level and also the basemap layers are re-initialized
        // so the previous WMS legend is removed and a new (empty) one is created that is filled with the new configuration
      }
    }

    return ({
        init: () => {
          return new LayerGroup({
            ...options,
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
